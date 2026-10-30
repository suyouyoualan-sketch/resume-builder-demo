"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import styles from "./MacosScrollbar.module.css";

const PdfPreview = dynamic(() => import("./PdfPreview"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-sm text-gray-600">
      Loading preview...
    </div>
  ),
});

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
  name: "Harry James Potter",
  email: "harry.potter@owlpost.example",
  phone: "",
  address: "12 Grimmauld Place",
  cityStateZip: "London, United Kingdom",
  education: [
    {
      school: "Hogwarts School of Witchcraft and Wizardry",
      location: "Highlands, Scotland",
      degree: "Secondary Magical Education",
      major: "Defence Against the Dark Arts, Gryffindor House",
      gpa: "",
      dates: "Sep 1991 - Jun 1997",
      thesis: "",
      relevantCoursework:
        "Defence Against the Dark Arts, Charms, Transfiguration, Potions, Herbology, Care of Magical Creatures",
    },
  ],
  honorAwards: [
    {
      organization: "Hogwarts School of Witchcraft and Wizardry",
      dates: "1993",
      bullets:
        "Received the Special Award for Services to the School\nHelped protect the school and its students from a dangerous magical threat",
    },
    {
      organization: "International Triwizard Tournament",
      dates: "1994 - 1995",
      bullets:
        "Selected as Hogwarts champion in an international magical competition\nCompleted three advanced challenges involving dragons, underwater rescue, and an enchanted maze",
    },
    {
      organization: "Ministry of Magic",
      dates: "1998",
      bullets:
        "Awarded the Order of Merlin, First Class, for exceptional courage and service to the wizarding community",
    },
  ],
  experience: [
    {
      organization: "Horcrux Search and Recovery Mission",
      location: "United Kingdom",
      positionTitle: "Field Operative",
      supervisor: "Albus Dumbledore",
      dates: "Jun 1997 - May 1998",
      bullets:
        "Located and helped destroy multiple concealed dark magical artefacts\nConducted high-risk field operations while evading hostile forces and government surveillance\nCollaborated with a three-person team to research clues, solve protective enchantments, and complete time-sensitive objectives\nContributed directly to the defeat of Lord Voldemort during the Battle of Hogwarts",
    },
    {
      organization: "Order of the Phoenix",
      location: "United Kingdom",
      positionTitle: "Resistance Member",
      supervisor: "Sirius Black and Albus Dumbledore",
      dates: "Jun 1995 - May 1998",
      bullets:
        "Supported defensive operations against Voldemort and the Death Eaters\nParticipated in rescue missions at the Department of Mysteries and Malfoy Manor\nProtected students and civilians during multiple large-scale magical conflicts\nDemonstrated sound judgment and resilience in rapidly changing, high-pressure situations",
    },
    {
      organization: "Triwizard Tournament",
      location: "Hogwarts, Scotland",
      positionTitle: "Hogwarts Champion",
      supervisor: "",
      dates: "Oct 1994 - Jun 1995",
      bullets:
        "Prepared independently for complex magical challenges involving unfamiliar threats\nSummoned and controlled a broom under pressure to retrieve an objective guarded by a dragon\nUsed advanced underwater magic to complete a time-limited rescue operation\nNavigated an enchanted maze while responding to unpredictable obstacles",
    },
  ],
  leadership: [
    {
      organization: "Dumbledore's Army",
      location: "Hogwarts, Scotland",
      role: "Founder and Lead Instructor",
      dates: "Oct 1995 - Jun 1996",
      bullets:
        "Founded and led a student organization dedicated to practical defensive magic\nDesigned and delivered recurring lessons in shield charms, disarming spells, Patronus charms, and duelling strategy\nTrained more than 20 students with different levels of magical experience\nBuilt a collaborative and discreet organization under restrictive school policies",
    },
    {
      organization: "Gryffindor Quidditch Team",
      location: "Hogwarts, Scotland",
      role: "Seeker and Team Captain",
      dates: "Sep 1991 - Jun 1997",
      bullets:
        "Served as the youngest Hogwarts house-team player in more than a century\nLed team practices, coordinated match strategy, and supported player development\nWon multiple decisive matches through fast decision-making and precise aerial manoeuvring",
    },
  ],
  skills: {
    technical:
      "Defensive magic, Patronus Charm, Disarming Charm, Shield Charm, duelling, magical investigation, broomstick flight",
    language:
      "English native, Parseltongue",
    laboratory:
      "Potion preparation, magical plant handling, dark artefact identification, spell experimentation",
    interests:
      "Quidditch, magical history, flying, treacle tart, supporting young witches and wizards",
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
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

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
    <main className="h-dvh overflow-hidden overscroll-none grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 lg:p-8 bg-gray-400">
      <section className="bg-gray-200 rounded-xl shadow-sm overflow-hidden h-full min-h-0 min-w-0 flex flex-col">
        <div className={`${styles.macosScrollbar} flex-1 min-h-0 overflow-y-auto overscroll-contain p-6`}>
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 font-bold">EasyCV</h1>

          <p className="text-gray-600 mt-2">
            Build a Harvard-style ATS-friendly LaTeX resume.
            <br />
            Brought to you by Youyou.
          </p>

          <p className="mb-2 text-gray-400">
            Supports English, Chinese, Korean, and Japanese input. For best ATS
            compatibility, we recommend writing your resume mainly in English.
            <br />
            Your progress is automatically saved in this browser.
          </p>

          <p className="mb-2 text-red-400">
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

          </div>
        </div>

        <div className="shrink-0 border-t border-gray-300 bg-gray-200 px-6 py-4 space-y-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
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

            <div className="pt-3 border-t border-gray-300 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p>
                © {new Date().getFullYear()} Su Youyou. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="mailto:suyouyoualan@gmail.com"
                  className="text-gray-700 underline hover:text-black transition"
                >
                  suyouyoualan@gmail.com
                </a>

                <a
                  href="https://github.com/suyouyoualan-sketch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 underline hover:text-black transition"
                >
                  GitHub
                </a>

                <a
                  href="https://forms.gle/ksLr1G9649cXZfDi9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 underline hover:text-black transition"
                >
                  Contact / Feedback
                </a>
              </div>
            </div>
        </div>
      </section>

      <section className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm overflow-hidden h-full min-h-0 min-w-0">
        {pdfUrl ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-gray-300 bg-gray-200 px-4 py-2.5">
              <span className="text-sm font-medium tabular-nums text-gray-600">
                Preview zoom: {Math.round(previewZoom * 100)}%
              </span>

              <div className="inline-flex items-center gap-0.5 rounded-xl border border-black/10 bg-white/70 p-1 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-md">
                <button
                  onClick={zoomOutPreview}
                  aria-label="Zoom out"
                  title="Zoom out"
                  className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-base font-medium text-gray-700 transition duration-150 hover:bg-white hover:text-black hover:shadow-sm active:scale-[0.96]"
                >
                  −
                </button>

                <button
                  onClick={resetPreviewZoom}
                  className="flex h-8 min-w-14 items-center justify-center rounded-lg px-3 text-xs font-semibold text-gray-700 transition duration-150 hover:bg-white hover:text-black hover:shadow-sm active:scale-[0.96]"
                >
                  Reset
                </button>

                <button
                  onClick={zoomInPreview}
                  aria-label="Zoom in"
                  title="Zoom in"
                  className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-base font-medium text-gray-700 transition duration-150 hover:bg-white hover:text-black hover:shadow-sm active:scale-[0.96]"
                >
                  +
                </button>
              </div>
            </div>

            <div className={`${styles.macosScrollbar} flex-1 min-h-0 overflow-auto overscroll-contain bg-gray-300`}>
              <PdfPreview fileUrl={pdfUrl} zoom={previewZoom} />
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