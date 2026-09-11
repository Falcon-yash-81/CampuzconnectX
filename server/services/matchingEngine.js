/**
 * CampusConnect Smart Matching Engine
 * Implements weighted candidate scoring:
 * - Skill Match: 50%
 * - Availability: 20%
 * - Location: 15%
 * - Reputation: 15%
 */

const calculateMatches = (helpRequest, candidates) => {
  const reqSkills = (helpRequest.requiredSkills || []).map((s) =>
    s.trim().toLowerCase()
  );
  const reqLoc = (helpRequest.location || '').trim().toLowerCase();
  const reqAvail = (helpRequest.availability || 'Flexible').trim().toLowerCase();

  if (reqSkills.length === 0) return [];

  const scoredCandidates = candidates
    .filter((student) => {
      // Do not match the requester with themselves
      const requesterId =
        helpRequest.requester?._id || helpRequest.requester;
      return student._id.toString() !== requesterId.toString();
    })
    .map((student) => {
      const studentSkills = (student.skills || []).map((s) =>
        s.trim().toLowerCase()
      );
      const studentLoc = (student.department || '').trim().toLowerCase();
      const studentAvail = (student.availability || 'Flexible')
        .trim()
        .toLowerCase();

      // 1. Skill Match (50% max)
      const matchedSkills = [];
      const missingSkills = [];

      helpRequest.requiredSkills.forEach((skill) => {
        const norm = skill.trim().toLowerCase();
        if (studentSkills.includes(norm)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const skillRatio =
        reqSkills.length > 0 ? matchedSkills.length / reqSkills.length : 0;
      const skillScore = Math.min(skillRatio * 50, 50);

      // 2. Availability Match (20% max)
      let availabilityScore = 8;
      if (
        studentAvail === 'flexible' ||
        reqAvail === 'flexible' ||
        studentAvail === reqAvail
      ) {
        availabilityScore = 20;
      } else if (
        (studentAvail === 'weekdays' && reqAvail === 'today') ||
        (studentAvail === 'evenings' && reqAvail === 'today')
      ) {
        availabilityScore = 14;
      }

      // 3. Location Match (15% max)
      let locationScore = 7.5;
      if (reqLoc && studentLoc) {
        if (
          reqLoc.includes(studentLoc) ||
          studentLoc.includes(reqLoc) ||
          reqLoc === 'main campus'
        ) {
          locationScore = 15;
        } else {
          locationScore = 10;
        }
      }

      // 4. Reputation Score (15% max)
      const rep = Number(student.reputationScore) || 75;
      const reputationScore = Math.min(Math.max((rep / 100) * 15, 0), 15);

      const totalScore = Math.min(
        Math.round(
          skillScore + availabilityScore + locationScore + reputationScore
        ),
        100
      );

      return {
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          bio: student.bio,
          skills: student.skills,
          availability: student.availability,
          rating: student.rating,
          reputationScore: student.reputationScore,
          requestsHelped: student.requestsHelped,
        },
        compatibilityScore: totalScore,
        breakdown: {
          skillScore: Math.round(skillScore),
          availabilityScore: Math.round(availabilityScore),
          locationScore: Math.round(locationScore),
          reputationScore: Math.round(reputationScore),
        },
        matchedSkills,
        missingSkills,
      };
    })
    // Prioritize students who possess at least one requested skill
    .filter((c) => c.matchedSkills.length > 0)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return scoredCandidates;
};

module.exports = { calculateMatches };
