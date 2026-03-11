import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A tiny GLB with a simple quad (two triangles) so beginners have a model to swap out.
const positions = [
  -0.6, 0.0, 0.0,
   0.6, 0.0, 0.0,
   0.6, 0.9, 0.0,

  -0.6, 0.0, 0.0,
   0.6, 0.9, 0.0,
  -0.6, 0.9, 0.0,
];

const json = {
  asset: { version: "2.0" },
  buffers: [{ byteLength: positions.length * 4 }],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: positions.length * 4, target: 34962 },
  ],
  accessors: [
    {
      bufferView: 0,
      byteOffset: 0,
      componentType: 5126,
      count: positions.length / 3,
      type: "VEC3",
      min: [-0.6, 0.0, 0.0],
      max: [0.6, 0.9, 0.0],
    },
  ],
  meshes: [
    {
      primitives: [
        {
          attributes: { POSITION: 0 },
        },
      ],
    },
  ],
  nodes: [{ mesh: 0 }],
  scenes: [{ nodes: [0] }],
  scene: 0,
};

const jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
const jsonPadded = Buffer.concat([jsonBuffer, Buffer.alloc(jsonPadding, 0x20)]);

const binBuffer = Buffer.alloc(positions.length * 4);
positions.forEach((value, index) => {
  binBuffer.writeFloatLE(value, index * 4);
});

const binPadding = (4 - (binBuffer.length % 4)) % 4;
const binPadded = Buffer.concat([binBuffer, Buffer.alloc(binPadding, 0)]);

const totalLength = 12 + 8 + jsonPadded.length + 8 + binPadded.length;

const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0); // "glTF"
header.writeUInt32LE(2, 4); // version
header.writeUInt32LE(totalLength, 8);

const jsonChunkHeader = Buffer.alloc(8);
jsonChunkHeader.writeUInt32LE(jsonPadded.length, 0);
jsonChunkHeader.writeUInt32LE(0x4e4f534a, 4); // "JSON"

const binChunkHeader = Buffer.alloc(8);
binChunkHeader.writeUInt32LE(binPadded.length, 0);
binChunkHeader.writeUInt32LE(0x004e4942, 4); // "BIN\0"

const glbBuffer = Buffer.concat([
  header,
  jsonChunkHeader,
  jsonPadded,
  binChunkHeader,
  binPadded,
]);

const outputPath = path.resolve(__dirname, "../public/models/sample.glb");
await fs.writeFile(outputPath, glbBuffer);

console.log(`GLB written to ${outputPath}`);
