import { Student } from '../types';

/**
 * MediConnect Academic & Achievement Scoring Formula:
 * - CGPA: 40% (max 40 pts)
 * - Projects: 20% (max 20 pts, 5 pts per quality project)
 * - Internships: 20% (max 20 pts, 10 pts per internship experience)
 * - Skills & Certifications: 10% (max 10 pts, based on verified skills & certifications)
 * - Competitive Programming: 10% (max 10 pts, based on connected platforms and rating)
 */
export function calculateStudentScore(student: Partial<Student>): {
  total: number;
  breakdown: {
    cgpaScore: number;
    projectsScore: number;
    internshipsScore: number;
    skillsAndCertsScore: number;
    competitiveProgrammingScore: number;
  };
} {
  const cgpa = student.cgpa || 0;
  const projects = student.projects || [];
  const internships = student.internships || [];
  const skills = student.skills || [];
  const certs = student.certifications || [];
  const profiles = student.externalProfiles || {};

  // 1. CGPA (40%)
  const cgpaScore = Math.min(40, (cgpa / 10) * 40);

  // 2. Projects (20%) -> 5 pts per project, bonus for demo/github
  let projectPoints = 0;
  for (const p of projects) {
    let pVal = 4;
    if (p.githubUrl) pVal += 0.5;
    if (p.demoUrl) pVal += 0.5;
    projectPoints += pVal;
  }
  const projectsScore = Math.min(20, projectPoints);

  // 3. Internships (20%) -> 10 pts per internship
  const internshipsScore = Math.min(20, internships.length * 10);

  // 4. Skills & Certifications (10%)
  const skillPoints = skills.length * 0.4;
  const certPoints = certs.length * 2.5;
  const skillsAndCertsScore = Math.min(10, skillPoints + certPoints);

  // 5. Competitive Programming (10%)
  let cpPoints = 0;
  if (profiles.leetcode) cpPoints += 3.5;
  if (profiles.codeforces) cpPoints += 3.5;
  if (profiles.codechef) cpPoints += 1.5;
  if (profiles.geeksforgeeks) cpPoints += 1.5;
  const competitiveProgrammingScore = Math.min(10, cpPoints);

  const total = parseFloat((cgpaScore + projectsScore + internshipsScore + skillsAndCertsScore + competitiveProgrammingScore).toFixed(1));

  return {
    total,
    breakdown: {
      cgpaScore: parseFloat(cgpaScore.toFixed(1)),
      projectsScore: parseFloat(projectsScore.toFixed(1)),
      internshipsScore: parseFloat(internshipsScore.toFixed(1)),
      skillsAndCertsScore: parseFloat(skillsAndCertsScore.toFixed(1)),
      competitiveProgrammingScore: parseFloat(competitiveProgrammingScore.toFixed(1)),
    }
  };
}

export function calculateProfileCompletion(student: Partial<Student>): {
  percentage: number;
  missingItems: string[];
} {
  const missingItems: string[] = [];
  let points = 0;
  const totalWeight = 7;

  if (student.name && student.bio && student.profilePhoto) {
    points += 1;
  } else {
    missingItems.push('Complete basic bio & photo');
  }

  if (student.cgpa && student.course && student.branch) {
    points += 1;
  } else {
    missingItems.push('Academic branch & CGPA');
  }

  if (student.skills && student.skills.length >= 3) {
    points += 1;
  } else {
    missingItems.push('Add at least 3 skills');
  }

  if (student.projects && student.projects.length >= 1) {
    points += 1;
  } else {
    missingItems.push('Add at least 1 project');
  }

  if (student.internships && student.internships.length >= 1) {
    points += 1;
  } else {
    missingItems.push('Add internship experience');
  }

  if (student.certifications && student.certifications.length >= 1) {
    points += 1;
  } else {
    missingItems.push('Add a certification');
  }

  if (student.externalProfiles && (student.externalProfiles.github || student.externalProfiles.linkedin)) {
    points += 1;
  } else {
    missingItems.push('Link GitHub / LinkedIn');
  }

  const percentage = Math.round((points / totalWeight) * 100);
  return { percentage, missingItems };
}
