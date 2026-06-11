"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import type { FieldValue } from "@/store/configurator";
import { violaoAco } from "@/data/instruments/violao";

/* ────────────────────────────────────────────────────────────────────────────
 * Conceptual 3D guitar built procedurally from the user's selections.
 * It is intentionally stylized: shapes and colors follow the configuration,
 * the real instrument follows the PDF.
 * ──────────────────────────────────────────────────────────────────────────── */

type Values = Record<string, FieldValue>;

function swatchOf(fieldId: string, values: Values, fallback: string): string {
  const optionId = values[fieldId]?.optionId;
  for (const step of violaoAco.steps) {
    for (const field of step.fields) {
      if (field.id === fieldId && field.kind === "choice") {
        const opt = field.options.find((o) => o.id === optionId);
        return opt?.swatch ?? fallback;
      }
    }
  }
  return fallback;
}

function optionId(fieldId: string, values: Values): string | undefined {
  return values[fieldId]?.optionId;
}

function blend(a: string, b: string, t: number): string {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return `#${ca.lerp(cb, t).getHexString()}`;
}

/* Body outline parameters per shape (conceptual proportions). */
const SHAPES: Record<
  string,
  { L: number; upper: number; waist: number; lower: number }
> = {
  classico: { L: 4.8, upper: 2.8, waist: 2.4, lower: 3.7 },
  auditorio: { L: 5.0, upper: 2.9, waist: 2.3, lower: 3.9 },
  dreadnought: { L: 5.0, upper: 3.0, waist: 2.75, lower: 3.9 },
  jumbo: { L: 5.2, upper: 3.1, waist: 2.4, lower: 4.3 },
  om: { L: 4.7, upper: 2.7, waist: 2.2, lower: 3.6 },
  parlor: { L: 4.4, upper: 2.4, waist: 2.0, lower: 3.2 },
};

function buildBodyShape(
  p: (typeof SHAPES)[string],
  cutaway: "sem" | "venetian" | "florentine",
): THREE.Shape {
  const { L, upper, waist, lower } = p;
  const top = L / 2;
  const bottom = -L / 2;
  const yUpper = top - L * 0.18;
  const yWaist = top - L * 0.45;
  const yLower = top - L * 0.75;

  const shape = new THREE.Shape();
  shape.moveTo(0, top);

  // Right side (cutaway side when present)
  if (cutaway === "sem") {
    shape.bezierCurveTo(upper * 0.38, top, upper / 2, yUpper + L * 0.1, upper / 2, yUpper);
  } else if (cutaway === "venetian") {
    // Smooth scooped cutaway
    shape.bezierCurveTo(0.45, top, 0.5, top - L * 0.06, 0.55, top - L * 0.1);
    shape.bezierCurveTo(0.7, top - L * 0.17, upper * 0.42, yUpper + L * 0.04, upper / 2, yUpper);
  } else {
    // Florentine: sharper horn
    shape.lineTo(0.5, top);
    shape.bezierCurveTo(0.62, top - L * 0.02, 0.42, top - L * 0.1, 0.62, top - L * 0.15);
    shape.bezierCurveTo(0.95, top - L * 0.19, upper * 0.45, yUpper + L * 0.03, upper / 2, yUpper);
  }
  shape.bezierCurveTo(upper / 2, yWaist + L * 0.12, waist / 2, yWaist + L * 0.06, waist / 2, yWaist);
  shape.bezierCurveTo(waist / 2, yWaist - L * 0.07, lower / 2, yLower + L * 0.12, lower / 2, yLower);
  shape.bezierCurveTo(lower / 2, bottom + L * 0.04, lower * 0.22, bottom, 0, bottom);

  // Left side (mirror, never cut)
  shape.bezierCurveTo(-lower * 0.22, bottom, -lower / 2, bottom + L * 0.04, -lower / 2, yLower);
  shape.bezierCurveTo(-lower / 2, yLower + L * 0.12, -waist / 2, yWaist - L * 0.07, -waist / 2, yWaist);
  shape.bezierCurveTo(-waist / 2, yWaist + L * 0.06, -upper / 2, yWaist + L * 0.12, -upper / 2, yUpper);
  shape.bezierCurveTo(-upper / 2, yUpper + L * 0.1, -upper * 0.38, top, 0, top);

  return shape;
}

function GuitarModel({
  modelId,
  values,
}: {
  modelId: string | null;
  values: Values;
}) {
  // Body shape comes from the chosen model (replaces the old "formato" field).
  const model = violaoAco.models.find((m) => m.id === modelId);
  const shapeId = model?.shape ?? "om";
  const params = SHAPES[shapeId] ?? SHAPES.om;

  const cutawayRaw = optionId("cutaway", values);
  const cutawayId: "sem" | "venetian" | "florentine" =
    cutawayRaw === "veneziano"
      ? "venetian"
      : cutawayRaw === "florentino"
        ? "florentine"
        : "sem";

  const finishedTop = swatchOf("tampo", values, "#d9b98a");
  const finishedSides = swatchOf("fundoLateral", values, "#7c4a26");
  const neckWood = swatchOf("braco", values, "#7c4a26");
  const boardWood = swatchOf("escala", values, "#1d160f");
  const tunerColor = swatchOf("tarraxasAcabamento", values, "#c9a227");
  const roughness = 0.2;

  // Map the spreadsheet's marker styles to viewer primitives.
  const marcacao = optionId("marcacao", values);
  const markers =
    marcacao === "dots-6mm"
      ? "pontos"
      : marcacao === "cruz-losango"
        ? "diamantes"
        : marcacao === "floral"
          ? "madreperola"
          : "sem";

  const headstockId = optionId("headstock", values) ?? "modelo-1";
  const pickguardId = optionId("escudo", values);
  const showPickguard = Boolean(pickguardId) && pickguardId !== "sem-escudo";
  const pickguardColor = swatchOf("escudo", values, "#5c3018");

  const { bodyGeom, topGeom } = useMemo(() => {
    const shape = buildBodyShape(params, cutawayId);
    const bodyGeom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 32,
    });
    bodyGeom.translate(0, 0, -0.425);
    const topGeom = new THREE.ShapeGeometry(shape, 32);
    return { bodyGeom, topGeom };
  }, [params, cutawayId]);

  const L = params.L;
  const yNeckJoint = L / 2;
  const neckLen = 3.0;
  const yHole = L / 2 - L * 0.3;
  const yBridge = L / 2 - L * 0.62;
  const zTop = 0.47;

  const fretYs = useMemo(() => {
    const ys: number[] = [];
    for (let i = 1; i <= 12; i++) {
      ys.push(yNeckJoint + neckLen - (neckLen * Math.log2(1 + i / 12)) * 1.4);
    }
    return ys.filter((y) => y > yNeckJoint + 0.05);
  }, [yNeckJoint]);

  const markerFrets = [3, 5, 7, 9];

  return (
    <group rotation={[0.08, 0, 0]} position={[0, -0.9, 0]} scale={0.82}>
      {/* Body */}
      <mesh geometry={bodyGeom}>
        <meshStandardMaterial color={finishedSides} roughness={roughness} metalness={0.05} />
      </mesh>
      {/* Soundboard (top) */}
      <mesh geometry={topGeom} position={[0, 0, zTop]}>
        <meshStandardMaterial color={finishedTop} roughness={roughness} metalness={0.04} />
      </mesh>

      {/* Soundhole + rosette */}
      <mesh position={[0, yHole, zTop + 0.005]}>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial color="#0a0705" roughness={0.9} />
      </mesh>
      <mesh position={[0, yHole, zTop + 0.006]}>
        <ringGeometry args={[0.58, 0.7, 48]} />
        <meshStandardMaterial color="#c9a227" roughness={0.35} metalness={0.55} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, yBridge, zTop + 0.04]}>
        <boxGeometry args={[1.15, 0.28, 0.09]} />
        <meshStandardMaterial color="#16100a" roughness={0.6} />
      </mesh>

      {/* Pickguard */}
      {showPickguard && (
        <mesh position={[0.85, yHole - 0.35, zTop + 0.004]} rotation={[0, 0, -0.5]}>
          <circleGeometry args={[0.55, 32]} />
          <meshStandardMaterial color={pickguardColor} roughness={0.3} />
        </mesh>
      )}

      {/* Neck */}
      <mesh position={[0, yNeckJoint + neckLen / 2 - 0.1, zTop - 0.16]}>
        <boxGeometry args={[0.52, neckLen, 0.22]} />
        <meshStandardMaterial color={neckWood} roughness={0.5} />
      </mesh>
      {/* Fretboard */}
      <mesh position={[0, yNeckJoint + neckLen / 2 - 0.1, zTop - 0.02]}>
        <boxGeometry args={[0.56, neckLen, 0.07]} />
        <meshStandardMaterial color={boardWood} roughness={0.45} />
      </mesh>

      {/* Frets */}
      {fretYs.map((y) => (
        <mesh key={y} position={[0, y, zTop + 0.016]}>
          <boxGeometry args={[0.56, 0.025, 0.012]} />
          <meshStandardMaterial color="#b8b2a6" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Fretboard markers */}
      {markers !== "sem" &&
        markerFrets.map((f) => {
          if (f >= fretYs.length) return null;
          const y = (fretYs[f - 1] + fretYs[f]) / 2;
          return (
            <mesh key={f} position={[0, y, zTop + 0.02]} rotation={[0, 0, markers === "diamantes" ? Math.PI / 4 : 0]}>
              {markers === "pontos" || markers === "madreperola" ? (
                <circleGeometry args={[0.05, 24]} />
              ) : (
                <planeGeometry args={[0.12, 0.12]} />
              )}
              <meshStandardMaterial
                color={markers === "madreperola" ? "#e8e3da" : "#ddd6c8"}
                metalness={0.4}
                roughness={0.25}
              />
            </mesh>
          );
        })}

      {/* Headstock */}
      <group position={[0, yNeckJoint + neckLen + 0.42, zTop - 0.14]} rotation={[-0.18, 0, 0]}>
        <mesh>
          <boxGeometry args={[headstockId === "solido-moderno" ? 0.55 : 0.72, 1.05, 0.14]} />
          <meshStandardMaterial color={blend(neckWood, "#1a120a", 0.35)} roughness={0.4} />
        </mesh>
        {headstockId === "slotted" &&
          [-0.16, 0.16].map((x) => (
            <mesh key={x} position={[x, 0, 0.072]}>
              <planeGeometry args={[0.14, 0.78]} />
              <meshStandardMaterial color="#0a0705" roughness={0.9} />
            </mesh>
          ))}
        {headstockId === "bocatto" && (
          <mesh position={[0, 0.45, 0.0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.16, 24]} />
            <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.25} />
          </mesh>
        )}
        {/* Tuners */}
        {[-1, 1].map((side) =>
          [-0.3, 0, 0.3].map((y) => (
            <mesh
              key={`${side}-${y}`}
              position={[side * 0.42, y, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
              <meshStandardMaterial color={tunerColor} metalness={0.8} roughness={0.25} />
            </mesh>
          )),
        )}
      </group>

      {/* Strings (steel) */}
      {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((x, i) => {
        const yTop = yNeckJoint + neckLen + 0.1;
        const len = yTop - yBridge;
        const r = 0.008 - i * 0.0005;
        return (
          <mesh key={x} position={[x, yBridge + len / 2, zTop + 0.05]}>
            <cylinderGeometry args={[r, r, len, 8]} />
            <meshStandardMaterial color="#cfc8b8" metalness={0.85} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function GuitarViewer({
  modelId,
  values,
}: {
  modelId: string | null;
  values: Values;
}) {
  const t = useTranslations("config");
  // Lazy init: this component only renders client-side (next/dynamic ssr:false).
  const [webgl] = useState(() => {
    if (typeof document === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      return false;
    }
  });

  if (!webgl) {
    return (
      <div className="h-[420px] flex items-center justify-center text-muted text-sm px-6 text-center">
        {t("viewerFallback")}
      </div>
    );
  }

  return (
    <div className="h-[420px]">
      <Canvas camera={{ position: [0, 0, 8.6], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 6]} intensity={1.4} color="#fff4dd" />
        <directionalLight position={[-6, 2, -4]} intensity={0.5} color="#c9a227" />
        <directionalLight position={[0, -4, 5]} intensity={0.25} color="#ffffff" />
        <GuitarModel modelId={modelId} values={values} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={13}
          minPolarAngle={Math.PI * 0.32}
          maxPolarAngle={Math.PI * 0.62}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
