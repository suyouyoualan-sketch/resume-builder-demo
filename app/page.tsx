"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type EducationData = {
  university: string;
  universityLocation: string;
  degree: string;
  graduationDate: string;
  thesis: string;
  relevantCoursework: string;

  studyAbroadSchool: string;
  studyAbroadLocation: string;
  studyAbroadCoursework: string;
  studyAbroadDates: string;

  highSchoolName: string;
  highSchoolLocation: string;
  highSchoolDetails: string;
  highSchoolGraduationDate: string;
};

type ExperienceItem = {
  organization: string;
  location: string;
  positionTitle: string;
  dates: string;
  bullets: string;
};

type LeadershipItem = {
  organization: string;
  location: string;
  role: string;
  dates: string;
  bullets: string;
};

type SkillsData = {
  technical: string;
  language: string;
  laboratory: string;
  interests: string;
};

type ResumeForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  education: EducationData;
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  skills: SkillsData;
};

type RootTextField = "name" | "email" | "phone" | "address" | "cityStateZip";

const emptyExperience: ExperienceItem = {
  organization: "",
  location: "",
  positionTitle: "",
  dates: "",
  bullets: "",
};

const emptyLeadership: LeadershipItem = {
  organization: "",
  location: "",
  role: "",
  dates: "",
  bullets: "",
};

const emptyForm: ResumeForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  cityStateZip: "",
  education: {
    university: "",
    universityLocation: "",
    degree: "",
    graduationDate: "",
    thesis: "",
    relevantCoursework: "",

    studyAbroadSchool: "",
    studyAbroadLocation: "",
    studyAbroadCoursework: "",
    studyAbroadDates: "",

    highSchoolName: "",
    highSchoolLocation: "",
    highSchoolDetails: "",
    highSchoolGraduationDate: "",
  },
  experience: [{ ...emptyExperience }],
  leadership: [{ ...emptyLeadership }],
  skills: {
    technical: "",
    language: "",
    laboratory: "",
    interests: "",
  },
};

const exampleForm: ResumeForm = {
  name: "Alex Chen",
  email: "alex.chen@college.edu",
  phone: "+1 617 555 0123",
  address: "123 Harvard Yard",
  cityStateZip: "Cambridge, MA 02138",
  education: {
    university: "Harvard University",
    universityLocation: "Cambridge, MA",
    degree: "B.A. in Economics, Secondary in Computer Science. GPA: 3.85/4.00",
    graduationDate: "May 2027",
    thesis: "Market Design for Digital Platforms",
    relevantCoursework:
      "Data Structures, Econometrics, Linear Algebra, Algorithms, Corporate Finance",

    studyAbroadSchool: "Study Abroad, University of Oxford",
    studyAbroadLocation: "Oxford, United Kingdom",
    studyAbroadCoursework: "economic history, political theory, and statistics",
    studyAbroadDates: "Jan 2026 - Jun 2026",

    highSchoolName: "",
    highSchoolLocation: "",
    highSchoolDetails: "",
    highSchoolGraduationDate: "",
  },
  experience: [
    {
      organization: "Crimson Analytics Lab",
      location: "Cambridge, MA",
      positionTitle: "Research Assistant",
      dates: "Sep 2025 - Present",
      bullets:
        "Analyzed 50,000+ transaction records using Python and SQL to identify consumer behavior trends\nBuilt automated data-cleaning scripts that reduced weekly processing time by 40%\nPresented findings to a 6-person research team through concise technical memos",
    },
    {
      organization: "Northstar Ventures",
      location: "Remote",
      positionTitle: "Summer Analyst",
      dates: "Jun 2025 - Aug 2025",
      bullets:
        "Evaluated 30+ early-stage startups across fintech, education technology, and AI infrastructure\nPrepared market maps and competitor analyses for investment committee discussions\nCreated financial summaries using Excel to compare revenue models and growth assumptions",
    },
  ],
  leadership: [
    {
      organization: "Undergraduate Consulting Club",
      location: "Cambridge, MA",
      role: "Project Lead",
      dates: "Sep 2024 - Present",
      bullets:
        "Led a 5-student team advising a local nonprofit on donor engagement strategy\nCoordinated weekly client meetings and delivered final recommendations to senior management",
    },
  ],
  skills: {
    technical: "Python, SQL, Excel, TypeScript, R, LaTeX, Git",
    language: "English native, Mandarin fluent, French intermediate",
    laboratory: "",
    interests: "Tennis, documentary filmmaking, behavioral economics, specialty coffee",
  },
};

export default function Home() {
  const [form, setForm] = useState<ResumeForm>(emptyForm);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPreviewOutdated, setIsPreviewOutdated] = useState(false);

  const downloadFileName = useMemo(() => {
    const baseName = form.name.trim() || "resume";

    return `${baseName}-harvard-resume.pdf`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [form.name]);

  function markPreviewOutdated() {
    if (pdfUrl) {
      setIsPreviewOutdated(true);
    }
  }

  function updateRootField(field: RootTextField, value: string) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  function updateEducationField(field: keyof EducationData, value: string) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      education: {
        ...previousForm.education,
        [field]: value,
      },
    }));
  }

  function updateSkillsField(field: keyof SkillsData, value: string) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      skills: {
        ...previousForm.skills,
        [field]: value,
      },
    }));
  }

  function updateExperienceField(
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextExperience = [...previousForm.experience];

      nextExperience[index] = {
        ...nextExperience[index],
        [field]: value,
      };

      return {
        ...previousForm,
        experience: nextExperience,
      };
    });
  }

  function updateLeadershipField(
    index: number,
    field: keyof LeadershipItem,
    value: string
  ) {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextLeadership = [...previousForm.leadership];

      nextLeadership[index] = {
        ...nextLeadership[index],
        [field]: value,
      };

      return {
        ...previousForm,
        leadership: nextLeadership,
      };
    });
  }

  function addExperience() {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      experience: [...previousForm.experience, { ...emptyExperience }],
    }));
  }

  function removeExperience(index: number) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      experience:
        previousForm.experience.length > 1
          ? previousForm.experience.filter((_, itemIndex) => itemIndex !== index)
          : previousForm.experience,
    }));
  }

  function addLeadership() {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      leadership: [...previousForm.leadership, { ...emptyLeadership }],
    }));
  }

  function removeLeadership(index: number) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      leadership:
        previousForm.leadership.length > 1
          ? previousForm.leadership.filter((_, itemIndex) => itemIndex !== index)
          : previousForm.leadership,
    }));
  }

  function loadExample() {
    setForm(exampleForm);
    setIsPreviewOutdated(Boolean(pdfUrl));
  }

  function clearForm() {
    setForm(emptyForm);
    setPdfUrl(null);
    setIsPreviewOutdated(false);
    setProgress(0);
  }

  async function generatePDF() {
    let progressTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setIsGenerating(true);
      setProgress(5);

      progressTimer = setInterval(() => {
        setProgress((previousProgress) => {
          if (previousProgress < 30) return previousProgress + 5;
          if (previousProgress < 70) return previousProgress + 3;
          if (previousProgress < 90) return previousProgress + 1;
          return previousProgress;
        });
      }, 300);

      const response = await fetch("/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`PDF generation failed:\n\n${errorText}`);
        setProgress(0);
        return;
      }

      setProgress(95);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url);
      setIsPreviewOutdated(false);
      setProgress(100);
    } catch (error) {
      console.error(error);
      alert("PDF generation failed. Please check your input and try again.");
      setProgress(0);
    } finally {
      if (progressTimer) {
        clearInterval(progressTimer);
      }

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 700);
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-8 bg-gray-400">
      <section className="bg-gray-200 rounded-xl shadow-sm p-6 overflow-y-auto h-[95vh]">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 font-bold">Resume Builder</h1>

          <p className="text-gray-600 mt-2">
            Build a Harvard-style ATS-friendly LaTeX resume.
          </p>

          <p className="mb-2 text-gray-400">
            Supports English, Chinese, Korean, and Japanese input. For best ATS
            compatibility, we recommend writing your resume mainly in English.
          </p>

          <p className="mb-3 font-medium text-gray-400">
            Beta version: please do not enter sensitive personal information during
            testing.
          </p>

          <a
            href="https://forms.gle/ksLr1G9649cXZfDi9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline"
          >
            Give feedback
          </a>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={loadExample}
              className="bg-white text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Load Example
            </button>

            <button
              onClick={clearForm}
              className="bg-white text-red-700 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Clear Form
            </button>
          </div>
        </div>

        <div className="text-gray-700 space-y-8">
          <FormSection title="Personal Information">
            <InputField
              label="Full Name"
              placeholder="Firstname Lastname"
              value={form.name}
              onChange={(value) => updateRootField("name", value)}
            />

            <InputField
              label="Home or Campus Street Address"
              placeholder="Home or Campus Street Address"
              value={form.address}
              onChange={(value) => updateRootField("address", value)}
            />

            <InputField
              label="City, State Zip"
              placeholder="City, State Zip"
              value={form.cityStateZip}
              onChange={(value) => updateRootField("cityStateZip", value)}
            />

            <InputField
              label="Email"
              placeholder="youremail@college.harvard.edu"
              value={form.email}
              onChange={(value) => updateRootField("email", value)}
            />

            <InputField
              label="Phone"
              placeholder="phone number"
              value={form.phone}
              onChange={(value) => updateRootField("phone", value)}
            />
          </FormSection>

          <FormSection title="Education">
            <InputField
              label="University"
              placeholder="Harvard University"
              value={form.education.university}
              onChange={(value) => updateEducationField("university", value)}
            />

            <InputField
              label="University Location"
              placeholder="Cambridge, MA"
              value={form.education.universityLocation}
              onChange={(value) =>
                updateEducationField("universityLocation", value)
              }
            />

            <InputField
              label="Degree, Concentration, GPA"
              helperText="Example: B.Sc. in Physics and Mathematics. GPA: 4.80/5.00"
              placeholder="Degree, Concentration. GPA: 3.90/4.00"
              value={form.education.degree}
              onChange={(value) => updateEducationField("degree", value)}
            />

            <InputField
              label="Graduation Date"
              helperText="Example: May 2027"
              placeholder="May 2027"
              value={form.education.graduationDate}
              onChange={(value) =>
                updateEducationField("graduationDate", value)
              }
            />

            <InputField
              label="Thesis"
              helperText="Optional. Leave blank if not applicable."
              placeholder="Optional thesis title"
              value={form.education.thesis}
              onChange={(value) => updateEducationField("thesis", value)}
            />

            <TextAreaField
              label="Relevant Coursework / Awards / Honors"
              helperText="Optional. Use commas to separate courses, awards, or honors."
              placeholder="Algorithms, Linear Algebra, Quantum Mechanics, Machine Learning"
              value={form.education.relevantCoursework}
              onChange={(value) =>
                updateEducationField("relevantCoursework", value)
              }
            />
          </FormSection>

          <FormSection title="Study Abroad">
            <SectionHint text="Optional. Leave this whole section blank if not applicable; it will not appear in the PDF." />

            <InputField
              label="Study Abroad Program / School"
              placeholder="Study Abroad, University of Oxford"
              value={form.education.studyAbroadSchool}
              onChange={(value) =>
                updateEducationField("studyAbroadSchool", value)
              }
            />

            <InputField
              label="Study Abroad Location"
              placeholder="Oxford, United Kingdom"
              value={form.education.studyAbroadLocation}
              onChange={(value) =>
                updateEducationField("studyAbroadLocation", value)
              }
            />

            <InputField
              label="Study Abroad Coursework"
              placeholder="economics, politics, language, or other fields"
              value={form.education.studyAbroadCoursework}
              onChange={(value) =>
                updateEducationField("studyAbroadCoursework", value)
              }
            />

            <InputField
              label="Study Abroad Dates"
              helperText="Example: Jan 2026 - Jun 2026"
              placeholder="Month Year - Month Year"
              value={form.education.studyAbroadDates}
              onChange={(value) =>
                updateEducationField("studyAbroadDates", value)
              }
            />
          </FormSection>

          <FormSection title="High School">
            <SectionHint text="Optional for most university students. Leave blank if you do not want it in the PDF." />

            <InputField
              label="High School Name"
              placeholder="High School Name"
              value={form.education.highSchoolName}
              onChange={(value) =>
                updateEducationField("highSchoolName", value)
              }
            />

            <InputField
              label="High School Location"
              placeholder="City, State"
              value={form.education.highSchoolLocation}
              onChange={(value) =>
                updateEducationField("highSchoolLocation", value)
              }
            />

            <TextAreaField
              label="High School Details"
              placeholder="GPA, SAT/ACT scores, or academic honors"
              value={form.education.highSchoolDetails}
              onChange={(value) =>
                updateEducationField("highSchoolDetails", value)
              }
            />

            <InputField
              label="High School Graduation Date"
              placeholder="Graduation Date"
              value={form.education.highSchoolGraduationDate}
              onChange={(value) =>
                updateEducationField("highSchoolGraduationDate", value)
              }
            />
          </FormSection>

          <FormSection title="Experience">
            {form.experience.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Experience {index + 1}
                  </h3>

                  {form.experience.length > 1 && (
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <InputField
                  label="Organization"
                  placeholder="Organization"
                  value={item.organization}
                  onChange={(value) =>
                    updateExperienceField(index, "organization", value)
                  }
                />

                <InputField
                  label="Location"
                  placeholder="City, State (or Remote)"
                  value={item.location}
                  onChange={(value) =>
                    updateExperienceField(index, "location", value)
                  }
                />

                <InputField
                  label="Position Title"
                  placeholder="Position Title"
                  value={item.positionTitle}
                  onChange={(value) =>
                    updateExperienceField(index, "positionTitle", value)
                  }
                />

                <InputField
                  label="Dates"
                  helperText="Example: Jun 2025 - Aug 2025"
                  placeholder="Month Year - Month Year"
                  value={item.dates}
                  onChange={(value) =>
                    updateExperienceField(index, "dates", value)
                  }
                />

                <TextAreaField
                  label="Bullet Points"
                  helperText='One bullet per line. Do not type "-", "•", or numbering; the system adds bullet points automatically.'
                  placeholder={`Developed a LaTeX-based resume builder using Next.js and server-side PDF compilation
Implemented PDF preview using Blob URLs and iframe rendering
Designed an ATS-friendly resume generation pipeline for international students`}
                  value={item.bullets}
                  onChange={(value) =>
                    updateExperienceField(index, "bullets", value)
                  }
                />
              </div>
            ))}

            <button
              onClick={addExperience}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              Add Experience
            </button>
          </FormSection>

          <FormSection title="Leadership & Activities">
            <SectionHint text="Optional. Leave all entries blank if you do not want this section in the PDF." />

            {form.leadership.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Leadership {index + 1}
                  </h3>

                  {form.leadership.length > 1 && (
                    <button
                      onClick={() => removeLeadership(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <InputField
                  label="Organization"
                  placeholder="Organization"
                  value={item.organization}
                  onChange={(value) =>
                    updateLeadershipField(index, "organization", value)
                  }
                />

                <InputField
                  label="Location"
                  placeholder="City, State"
                  value={item.location}
                  onChange={(value) =>
                    updateLeadershipField(index, "location", value)
                  }
                />

                <InputField
                  label="Role"
                  placeholder="Role"
                  value={item.role}
                  onChange={(value) =>
                    updateLeadershipField(index, "role", value)
                  }
                />

                <InputField
                  label="Dates"
                  helperText="Example: Sep 2024 - Present"
                  placeholder="Month Year - Month Year"
                  value={item.dates}
                  onChange={(value) =>
                    updateLeadershipField(index, "dates", value)
                  }
                />

                <TextAreaField
                  label="Bullet Points"
                  helperText='One bullet per line. Do not type "-", "•", or numbering.'
                  placeholder={`Organized beginner-friendly events for 30+ students
Coordinated partnerships with external venues
Led weekly planning meetings and managed club communications`}
                  value={item.bullets}
                  onChange={(value) =>
                    updateLeadershipField(index, "bullets", value)
                  }
                />
              </div>
            ))}

            <button
              onClick={addLeadership}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              Add Leadership
            </button>
          </FormSection>

          <FormSection title="Skills & Interests">
            <SectionHint text="Optional. Only filled categories will appear in the PDF." />

            <TextAreaField
              label="Technical"
              placeholder="Python, TypeScript, Next.js, LaTeX, Git"
              value={form.skills.technical}
              onChange={(value) => updateSkillsField("technical", value)}
            />

            <TextAreaField
              label="Language"
              placeholder="English fluent, Chinese native, French intermediate"
              value={form.skills.language}
              onChange={(value) => updateSkillsField("language", value)}
            />

            <TextAreaField
              label="Laboratory"
              placeholder="NMR, spectroscopy, cleanroom, data analysis"
              value={form.skills.laboratory}
              onChange={(value) => updateSkillsField("laboratory", value)}
            />

            <TextAreaField
              label="Interests"
              placeholder="Quantum computing, racing, startups"
              value={form.skills.interests}
              onChange={(value) => updateSkillsField("interests", value)}
            />
          </FormSection>

          <div className="sticky bottom-0 bg-gray-200 py-4 space-y-3">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-500"
              >
                {isGenerating ? "Generating PDF..." : "Generate Preview"}
              </button>

              {pdfUrl && !isPreviewOutdated && !isGenerating && (
                <a
                  href={pdfUrl}
                  download={downloadFileName}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Download PDF
                </a>
              )}

              {pdfUrl && isPreviewOutdated && (
                <button
                  disabled
                  className="bg-gray-500 text-white px-5 py-2 rounded-lg cursor-not-allowed"
                >
                  Download Disabled
                </button>
              )}
            </div>

            {isGenerating && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Rendering PDF...</span>
                  <span>{progress}%</span>
                </div>

                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {pdfUrl && isPreviewOutdated && !isGenerating && (
              <p className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                You have changed the form after generating the preview. Generate
                again to update the PDF before downloading.
              </p>
            )}

            <p className="text-xs text-gray-600 lg:hidden">
              PDF preview is best viewed on desktop. On mobile, generate and
              download the PDF to inspect the result.
            </p>
          </div>
        </div>
      </section>

      <section className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden h-[95vh]">
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            PDF preview will appear here
          </div>
        )}
      </section>
    </main>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2">
        {title}
      </h2>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SectionHint({ text }: { text: string }) {
  return (
    <p className="text-sm text-gray-600 bg-white border border-gray-300 rounded-lg p-3">
      {text}
    </p>
  );
}

function InputField({
  label,
  helperText,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  helperText?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>

      {helperText && <p className="text-sm text-gray-500 mb-2">{helperText}</p>}

      <input
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextAreaField({
  label,
  helperText,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  helperText?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>

      {helperText && <p className="text-sm text-gray-500 mb-2">{helperText}</p>}

      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-black bg-white"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
