"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type EducationItem = {
  school: string;
  location: string;
  degree: string;
  major: string;
  gpa: string;
  dates: string;
  thesis: string;
  relevantCoursework: string;
};

type HonorAwardItem = {
  organization: string;
  dates: string;
  bullets: string;
};

type ExperienceItem = {
  organization: string;
  location: string;
  positionTitle: string;
  supervisor: string;
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
  education: EducationItem[];
  honorAwards: HonorAwardItem[];
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  skills: SkillsData;
};

type RootTextField = "name" | "email" | "phone" | "address" | "cityStateZip";

const emptyEducation: EducationItem = {
  school: "",
  location: "",
  degree: "",
  major: "",
  gpa: "",
  dates: "",
  thesis: "",
  relevantCoursework: "",
};

const emptyHonorAward: HonorAwardItem = {
  organization: "",
  dates: "",
  bullets: "",
};

const emptyExperience: ExperienceItem = {
  organization: "",
  location: "",
  positionTitle: "",
  supervisor: "",
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
  education: [{ ...emptyEducation }],
  honorAwards: [{ ...emptyHonorAward }],
  experience: [{ ...emptyExperience }],
  leadership: [{ ...emptyLeadership }],
  skills: {
    technical: "",
    language: "",
    laboratory: "",
    interests: "",
  },
};

const STORAGE_KEY = "resume-builder-form-data";

const exampleForm: ResumeForm = {
  name: "Alex Chen",
  email: "alex.chen@college.edu",
  phone: "+1 617 555 0123",
  address: "123 Harvard Yard",
  cityStateZip: "Cambridge, MA 02138",
  education: [
    {
      school: "Harvard University",
      location: "Cambridge, MA",
      degree: "B.A.",
      major: "Economics, Secondary in Computer Science",
      gpa: "3.85/4.00",
      dates: "May 2027",
      thesis: "Market Design for Digital Platforms",
      relevantCoursework:
        "Data Structures, Econometrics, Linear Algebra, Algorithms, Corporate Finance",
    },
    {
      school: "Study Abroad, University of Oxford",
      location: "Oxford, United Kingdom",
      degree: "Exchange Student",
      major: "Economic History, Political Theory, and Statistics",
      gpa: "",
      dates: "Jan 2026 - Jun 2026",
      thesis: "",
      relevantCoursework: "",
    },
  ],
  honorAwards: [
    {
      organization: "Harvard College",
      dates: "2026",
      bullets:
        "John Harvard Scholarship for academic achievement\nDean's List, Fall 2025 and Spring 2026",
    },
  ],
  experience: [
    {
      organization: "Three Languages of Quantum Mechanics (URECA Programme)",
      location: "Singapore",
      positionTitle: "Research Student",
      supervisor: "Prof. François Gay-Balmaz",
      dates: "May 2026 - Aug 2026",
      bullets:
        "Studied the equivalence between the Schrödinger, Heisenberg, and interaction pictures\nReviewed mathematical formulations of quantum mechanics using operators, states, and time evolution\nPrepared structured notes and derivations for a research-style undergraduate project",
    },
    {
      organization: "Northstar Ventures",
      location: "Remote",
      positionTitle: "Summer Analyst",
      supervisor: "",
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

function normalizeSavedForm(savedData: Partial<ResumeForm> & { education?: unknown }): ResumeForm {
  const previousEducation = savedData.education as
    | EducationItem[]
    | {
        university?: string;
        universityLocation?: string;
        degree?: string;
        major?: string;
        gpa?: string;
        graduationDate?: string;
        thesis?: string;
        relevantCoursework?: string;
        studyAbroadSchool?: string;
        studyAbroadLocation?: string;
        studyAbroadCoursework?: string;
        studyAbroadDates?: string;
        highSchoolName?: string;
        highSchoolLocation?: string;
        highSchoolDetails?: string;
        highSchoolGraduationDate?: string;
      }
    | undefined;

  let education: EducationItem[] = [{ ...emptyEducation }];

  if (Array.isArray(previousEducation)) {
    education = previousEducation.length > 0 ? previousEducation : [{ ...emptyEducation }];
  } else if (previousEducation && typeof previousEducation === "object") {
    education = [
      {
        school: previousEducation.university || "",
        location: previousEducation.universityLocation || "",
        degree: previousEducation.degree || "",
        major: previousEducation.major || "",
        gpa: previousEducation.gpa || "",
        dates: previousEducation.graduationDate || "",
        thesis: previousEducation.thesis || "",
        relevantCoursework: previousEducation.relevantCoursework || "",
      },
    ];

    if (
      previousEducation.studyAbroadSchool ||
      previousEducation.studyAbroadLocation ||
      previousEducation.studyAbroadCoursework ||
      previousEducation.studyAbroadDates
    ) {
      education.push({
        school: previousEducation.studyAbroadSchool || "Study Abroad",
        location: previousEducation.studyAbroadLocation || "",
        degree: "Exchange Student",
        major: previousEducation.studyAbroadCoursework || "",
        gpa: "",
        dates: previousEducation.studyAbroadDates || "",
        thesis: "",
        relevantCoursework: "",
      });
    }

    if (
      previousEducation.highSchoolName ||
      previousEducation.highSchoolLocation ||
      previousEducation.highSchoolDetails ||
      previousEducation.highSchoolGraduationDate
    ) {
      education.push({
        school: previousEducation.highSchoolName || "High School",
        location: previousEducation.highSchoolLocation || "",
        degree: "",
        major: previousEducation.highSchoolDetails || "",
        gpa: "",
        dates: previousEducation.highSchoolGraduationDate || "",
        thesis: "",
        relevantCoursework: "",
      });
    }
  }

  return {
    ...emptyForm,
    ...savedData,
    education,
    honorAwards:
      savedData.honorAwards && savedData.honorAwards.length > 0
        ? savedData.honorAwards
        : [{ ...emptyHonorAward }],
    experience:
      savedData.experience && savedData.experience.length > 0
        ? savedData.experience
        : [{ ...emptyExperience }],
    leadership:
      savedData.leadership && savedData.leadership.length > 0
        ? savedData.leadership
        : [{ ...emptyLeadership }],
    skills: {
      ...emptyForm.skills,
      ...(savedData.skills || {}),
    },
  };
}

export default function Home() {
  const [form, setForm] = useState<ResumeForm>(emptyForm);

  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);

    if (savedForm) {
      try {
        setForm(normalizeSavedForm(JSON.parse(savedForm)));
      } catch (error) {
        console.error("Failed to load saved form:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPreviewOutdated, setIsPreviewOutdated] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);

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

  function updateEducationField(
    index: number,
    field: keyof EducationItem,
    value: string
  ) {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextEducation = [...previousForm.education];

      nextEducation[index] = {
        ...nextEducation[index],
        [field]: value,
      };

      return {
        ...previousForm,
        education: nextEducation,
      };
    });
  }

  function addEducation() {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      education: [...previousForm.education, { ...emptyEducation }],
    }));
  }

  function removeEducation(index: number) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      education:
        previousForm.education.length > 1
          ? previousForm.education.filter((_, itemIndex) => itemIndex !== index)
          : previousForm.education,
    }));
  }

  function moveEducation(index: number, direction: "up" | "down") {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextEducation = [...previousForm.education];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= nextEducation.length) {
        return previousForm;
      }

      [nextEducation[index], nextEducation[targetIndex]] = [
        nextEducation[targetIndex],
        nextEducation[index],
      ];

      return {
        ...previousForm,
        education: nextEducation,
      };
    });
  }

  function updateHonorAwardField(
    index: number,
    field: keyof HonorAwardItem,
    value: string
  ) {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextHonorAwards = [...previousForm.honorAwards];

      nextHonorAwards[index] = {
        ...nextHonorAwards[index],
        [field]: value,
      };

      return {
        ...previousForm,
        honorAwards: nextHonorAwards,
      };
    });
  }

  function addHonorAward() {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      honorAwards: [...previousForm.honorAwards, { ...emptyHonorAward }],
    }));
  }

  function removeHonorAward(index: number) {
    markPreviewOutdated();

    setForm((previousForm) => ({
      ...previousForm,
      honorAwards:
        previousForm.honorAwards.length > 1
          ? previousForm.honorAwards.filter((_, itemIndex) => itemIndex !== index)
          : previousForm.honorAwards,
    }));
  }

  function moveHonorAward(index: number, direction: "up" | "down") {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextHonorAwards = [...previousForm.honorAwards];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= nextHonorAwards.length) {
        return previousForm;
      }

      [nextHonorAwards[index], nextHonorAwards[targetIndex]] = [
        nextHonorAwards[targetIndex],
        nextHonorAwards[index],
      ];

      return {
        ...previousForm,
        honorAwards: nextHonorAwards,
      };
    });
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

  function moveExperience(index: number, direction: "up" | "down") {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextExperience = [...previousForm.experience];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= nextExperience.length) {
        return previousForm;
      }

      [nextExperience[index], nextExperience[targetIndex]] = [
        nextExperience[targetIndex],
        nextExperience[index],
      ];

      return {
        ...previousForm,
        experience: nextExperience,
      };
    });
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

  function moveLeadership(index: number, direction: "up" | "down") {
    markPreviewOutdated();

    setForm((previousForm) => {
      const nextLeadership = [...previousForm.leadership];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= nextLeadership.length) {
        return previousForm;
      }

      [nextLeadership[index], nextLeadership[targetIndex]] = [
        nextLeadership[targetIndex],
        nextLeadership[index],
      ];

      return {
        ...previousForm,
        leadership: nextLeadership,
      };
    });
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

    localStorage.removeItem(STORAGE_KEY);
  }

  function zoomInPreview() {
    setPreviewZoom((zoom) => Math.min(zoom + 0.1, 1.8));
  }

  function zoomOutPreview() {
    setPreviewZoom((zoom) => Math.max(zoom - 0.1, 0.6));
  }

  function resetPreviewZoom() {
    setPreviewZoom(1);
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

          <p className="mb-3 text-sm text-gray-400">
            Your progress is automatically saved in this browser.
          </p>

          <p className="mb-3 font-medium text-red-400">
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
            {form.education.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-800">
                    Education {index + 1}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moveEducation(index, "up")}
                      disabled={index === 0}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↑ Up
                    </button>

                    <button
                      onClick={() => moveEducation(index, "down")}
                      disabled={index === form.education.length - 1}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↓ Down
                    </button>

                    {form.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <InputField
                  label="School / University / Institution"
                  helperText="Examples: Harvard University, ETH Zürich, Study Abroad - University of Oxford, Previous University."
                  placeholder="Harvard University"
                  value={item.school}
                  onChange={(value) => updateEducationField(index, "school", value)}
                />

                <InputField
                  label="Location"
                  placeholder="Cambridge, MA"
                  value={item.location}
                  onChange={(value) => updateEducationField(index, "location", value)}
                />

                <InputField
                  label="Degree / Program"
                  helperText="Examples: B.Sc., M.Sc., Ph.D., Exchange Student, Transfer Coursework."
                  placeholder="B.Sc."
                  value={item.degree}
                  onChange={(value) => updateEducationField(index, "degree", value)}
                />

                <InputField
                  label="Major / Concentration"
                  helperText="Example: Physics and Mathematics"
                  placeholder="Physics and Mathematics"
                  value={item.major}
                  onChange={(value) => updateEducationField(index, "major", value)}
                />

                <InputField
                  label="GPA"
                  helperText="Optional. Example: 4.80/5.00 or 3.85/4.00"
                  placeholder="4.80/5.00"
                  value={item.gpa}
                  onChange={(value) => updateEducationField(index, "gpa", value)}
                />

                <InputField
                  label="Dates"
                  helperText="Examples: May 2027, Aug 2026 - May 2028, 2024 - Present."
                  placeholder="Month Year - Month Year"
                  value={item.dates}
                  onChange={(value) => updateEducationField(index, "dates", value)}
                />

                <InputField
                  label="Thesis"
                  helperText="Optional. Leave blank if not applicable."
                  placeholder="Optional thesis title"
                  value={item.thesis}
                  onChange={(value) => updateEducationField(index, "thesis", value)}
                />

                <TextAreaField
                  label="Relevant Coursework / Academic Details"
                  helperText="Optional. Use commas to separate courses or details. Put honors and awards in the separate Honor & Awards section below."
                  placeholder="Algorithms, Linear Algebra, Quantum Mechanics, Machine Learning"
                  value={item.relevantCoursework}
                  onChange={(value) =>
                    updateEducationField(index, "relevantCoursework", value)
                  }
                />
              </div>
            ))}

            <button
              onClick={addEducation}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              Add Education
            </button>
          </FormSection>

          <FormSection title="Honor & Awards">
            <SectionHint text="Optional. Use this for awards, scholarships, competitions, fellowships, dean's list, or external honors that do not belong under one specific university." />

            {form.honorAwards.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-800">
                    Honor / Award {index + 1}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moveHonorAward(index, "up")}
                      disabled={index === 0}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↑ Up
                    </button>

                    <button
                      onClick={() => moveHonorAward(index, "down")}
                      disabled={index === form.honorAwards.length - 1}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↓ Down
                    </button>

                    {form.honorAwards.length > 1 && (
                      <button
                        onClick={() => removeHonorAward(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <InputField
                  label="Issuing Organization"
                  placeholder="Harvard College, Ministry of Education, Mathematical Association of America"
                  value={item.organization}
                  onChange={(value) =>
                    updateHonorAwardField(index, "organization", value)
                  }
                />

                <InputField
                  label="Date"
                  placeholder="2026"
                  value={item.dates}
                  onChange={(value) => updateHonorAwardField(index, "dates", value)}
                />

                <TextAreaField
                  label="Awards"
                  helperText='One award per line. Do not type "-", "•", or numbering; the system adds bullet points automatically.'
                  placeholder={`Dean's List, Fall 2025 and Spring 2026
First Prize, National Mathematics Competition
Merit Scholarship for academic excellence`}
                  value={item.bullets}
                  onChange={(value) =>
                    updateHonorAwardField(index, "bullets", value)
                  }
                />
              </div>
            ))}

            <button
              onClick={addHonorAward}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition"
            >
              Add Honor / Award
            </button>
          </FormSection>

          <FormSection title="Experience">
            {form.experience.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-xl p-4 bg-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-800">
                    Experience {index + 1}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moveExperience(index, "up")}
                      disabled={index === 0}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↑ Up
                    </button>

                    <button
                      onClick={() => moveExperience(index, "down")}
                      disabled={index === form.experience.length - 1}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↓ Down
                    </button>

                    {form.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <InputField
                  label="Organization / Project / Programme"
                  helperText="For research projects, you can enter the project title here. Example: Three Languages of Quantum Mechanics (URECA Programme)."
                  placeholder="Organization, Project, or Programme"
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
                  label="Role / Position"
                  placeholder="Research Student, Summer Analyst, Project Lead"
                  value={item.positionTitle}
                  onChange={(value) =>
                    updateExperienceField(index, "positionTitle", value)
                  }
                />

                <InputField
                  label="Supervisor / Mentor"
                  helperText="Optional. Useful for research projects, URECA, FYP, lab work, or summer research."
                  placeholder="Prof. Name or Mentor Name"
                  value={item.supervisor}
                  onChange={(value) =>
                    updateExperienceField(index, "supervisor", value)
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
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-800">
                    Leadership {index + 1}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moveLeadership(index, "up")}
                      disabled={index === 0}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↑ Up
                    </button>

                    <button
                      onClick={() => moveLeadership(index, "down")}
                      disabled={index === form.leadership.length - 1}
                      className="text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                    >
                      ↓ Down
                    </button>

                    {form.leadership.length > 1 && (
                      <button
                        onClick={() => removeLeadership(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
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

      <section className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm overflow-hidden h-[95vh]">
        {pdfUrl ? (
          <>
            <div className="flex items-center justify-between gap-3 px-4 py-2 border-b bg-gray-100">
              <span className="text-sm text-gray-600">
                Preview zoom: {Math.round(previewZoom * 100)}%
              </span>

              <div className="flex gap-2">
                <button
                  onClick={zoomOutPreview}
                  className="text-sm text-gray-900 border border-gray-300 px-3 py-1 rounded bg-white hover:bg-gray-100 transition"
                >
                  -
                </button>

                <button
                  onClick={resetPreviewZoom}
                  className="text-sm text-gray-900 border border-gray-300 px-3 py-1 rounded bg-white hover:bg-gray-100 transition"
                >
                  Reset
                </button>

                <button
                  onClick={zoomInPreview}
                  className="text-sm text-gray-900 border border-gray-300 px-3 py-1 rounded bg-white hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-300">
              <iframe
                src={`${pdfUrl}#toolbar=0`}
                className="border-0 bg-white"
                style={{
                  width: `${100 / previewZoom}%`,
                  height: `${100 / previewZoom}%`,
                  transform: `scale(${previewZoom})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </>
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
