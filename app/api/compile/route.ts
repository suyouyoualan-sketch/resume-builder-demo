import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { generateLatex } from "@/lib/latexTemplate";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const data = await req.json();

  const id = uuidv4();
  const dir = path.join(process.cwd(), "tmp", id);

  await mkdir(dir, { recursive: true });

  const texPath = path.join(dir, "resume.tex");
  const pdfPath = path.join(dir, "resume.pdf");

  const latex = generateLatex(data);
  await writeFile(texPath, latex);

  try {
    await execAsync(
      `pdflatex -interaction=nonstopmode -halt-on-error -output-directory="${dir}" "${texPath}"`
    );

    const pdf = await readFile(pdfPath);

    await rm(dir, { recursive: true, force: true });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    await rm(dir, { recursive: true, force: true });

    return NextResponse.json(
      {
        error: "LaTeX compilation failed",
      },
      {
        status: 500,
      }
    );
  }
}