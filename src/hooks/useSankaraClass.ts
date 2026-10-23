import { useState, useEffect, useCallback } from 'react';
import {
  ActiveClassSelection,
  loadSavedClassSelection,
  saveClassSelection,
  getSubjectsForClass,
  getProgramById,
  SankaraSubject,
  SankaraClassProgram,
} from '../data/sankaraCollegeData';

export function useSankaraClass() {
  const [activeSelection, setActiveSelection] = useState<ActiveClassSelection>(loadSavedClassSelection);

  useEffect(() => {
    // Listen for cross-component changes
    const handleClassChanged = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveClassSelection>;
      if (customEvent.detail) {
        setActiveSelection(customEvent.detail);
      }
    };

    window.addEventListener('sankara_class_changed', handleClassChanged);
    return () => {
      window.removeEventListener('sankara_class_changed', handleClassChanged);
    };
  }, []);

  const updateSelection = useCallback((newSelection: ActiveClassSelection) => {
    saveClassSelection(newSelection);
    setActiveSelection(newSelection);
  }, []);

  const changeSubject = useCallback((subject: SankaraSubject) => {
    setActiveSelection((prev) => {
      const updated: ActiveClassSelection = {
        ...prev,
        subjectCode: subject.code,
        subjectName: subject.name,
        category: subject.category,
        topics: subject.topics,
      };
      saveClassSelection(updated);
      return updated;
    });
  }, []);

  const changeSemester = useCallback((sem: number) => {
    setActiveSelection((prev) => {
      const subjects = getSubjectsForClass(prev.programId, sem);
      const firstSub = subjects[0];
      const updated: ActiveClassSelection = {
        ...prev,
        semester: sem,
        year: Math.ceil(sem / 2),
        subjectCode: firstSub ? firstSub.code : prev.subjectCode,
        subjectName: firstSub ? firstSub.name : prev.subjectName,
        category: firstSub ? firstSub.category : prev.category,
        topics: firstSub ? firstSub.topics : prev.topics,
      };
      saveClassSelection(updated);
      return updated;
    });
  }, []);

  const changeProgram = useCallback((program: SankaraClassProgram, defaultSemester?: number) => {
    const sem = defaultSemester || 1;
    const subjects = getSubjectsForClass(program.id, sem);
    const firstSub = subjects[0];
    const updated: ActiveClassSelection = {
      programId: program.id,
      programName: program.name,
      shortName: program.shortName,
      level: program.level,
      stream: program.stream,
      year: Math.ceil(sem / 2),
      semester: sem,
      subjectCode: firstSub ? firstSub.code : 'SUB101',
      subjectName: firstSub ? firstSub.name : 'General Foundation',
      category: firstSub ? firstSub.category : 'Core',
      topics: firstSub ? firstSub.topics : [],
    };
    saveClassSelection(updated);
    setActiveSelection(updated);
  }, []);

  const currentProgram = getProgramById(activeSelection.programId);
  const currentSemesterSubjects = getSubjectsForClass(activeSelection.programId, activeSelection.semester);

  return {
    activeSelection,
    currentProgram,
    currentSemesterSubjects,
    updateSelection,
    changeSubject,
    changeSemester,
    changeProgram,
  };
}
