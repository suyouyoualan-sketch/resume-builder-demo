import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir, rm } from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { generateLatex } from "@/lib/latexTemplate";

const execFileAsync = promisify(execFile);

const MAX_BODY_SIZE = 50_000; // 50 KB is enough for a resume
const LATEX_TIMEOUT_MS = 30_000; // 30 seconds

export async function POST(req: Request) {
  let dir: string | null = null;

  try {
    // 1. Read raw body first so we can limit input size
    const bodyText = await req.text();

    if (bodyText.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        {
          error: "Input too large. Please shorten your resume content.",
        },
        {
          status: 400,
        }
      );
    }

    let data;

    try {
      data = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON input.",
        },
        {
          status: 400,
        }
      );
    }

    // 2. Create isolated temporary directory
    const id = uuidv4();
    dir = path.join(process.cwd(), "tmp", id);

    await mkdir(dir, { recursive: true });

    const texPath = path.join(dir, "resume.tex");
    const pdfPath = path.join(dir, "resume.pdf");

    // 3. Generate and write LaTeX
    const latex = generateLatex(data);
    await writeFile(texPath, latex, "utf8");

    // 4. Run xelatex safely without shell command string
    await execFileAsync(
      "xelatex",
      [
        "-interaction=nonstopmode",
        "-halt-on-error",
        `-output-directory=${dir}`,
        texPath,
      ],
      {
        timeout: LATEX_TIMEOUT_MS,
        maxBuffer: 1024 * 1024 * 5,
      }
    );

    // 5. Read generated PDF
    const pdf = await readFile(pdfPath);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("LaTeX compilation failed:", error);

    return NextResponse.json(
      {
        error: "LaTeX compilation failed.",
      },
      {
        status: 500,
      }
    );
  } finally {
    // 6. Always clean up temporary directory
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  }
}
