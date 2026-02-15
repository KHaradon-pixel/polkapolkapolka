import { Session, TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    label: 'Session Block 1',
    startTime: '08:30 AM',
    endTime: '09:45 AM',
  },
  {
    id: 'slot-2',
    label: 'Session Block 2',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
  },
  {
    id: 'slot-3',
    label: 'Session Block 3',
    startTime: '01:00 PM',
    endTime: '02:15 PM',
  },
];

export const INITIAL_SESSIONS: Session[] = [
  // Slot 1
  {
    id: 's1-1',
    slotId: 'slot-1',
    title: 'AI in the Classroom: Beyond the Hype',
    description: 'Explore practical applications of generative AI tools like Gemini and ChatGPT to enhance lesson planning and student engagement without compromising academic integrity.',
    presenter: 'Dr. Sarah Jenkins',
    room: 'Library Media Center',
    capacity: 30,
    enrolled: 12,
  },
  {
    id: 's1-2',
    slotId: 'slot-1',
    title: 'Social Emotional Learning (SEL) Integrations',
    description: 'Learn strategies to seamlessly integrate SEL competencies into your daily curriculum to support student well-being and academic success.',
    presenter: 'Mark Thompson',
    room: 'Room 104',
    capacity: 25,
    enrolled: 25, // Full
  },
  {
    id: 's1-3',
    slotId: 'slot-1',
    title: 'Data-Driven Instruction with Canvas',
    description: 'Deep dive into Canvas analytics to track student progress and tailor instruction to meet individual needs effectively.',
    presenter: 'Emily Chen',
    room: 'Computer Lab 2',
    capacity: 20,
    enrolled: 18,
  },
  {
    id: 's1-4',
    slotId: 'slot-1',
    title: 'Inclusive Practices for Diverse Learners',
    description: 'A workshop focused on Universal Design for Learning (UDL) principles to create accessible learning environments for all students.',
    presenter: 'David Rodriguez',
    room: 'Room 208',
    capacity: 35,
    enrolled: 5,
  },

  // Slot 2
  {
    id: 's2-1',
    slotId: 'slot-2',
    title: 'Project-Based Learning: From Idea to Execution',
    description: 'Step-by-step guide to designing rigorous PBL units that foster critical thinking and collaboration skills.',
    presenter: 'Jessica Alverez',
    room: 'Innovation Lab',
    capacity: 25,
    enrolled: 20,
  },
  {
    id: 's2-2',
    slotId: 'slot-2',
    title: 'Advanced Google Workspace for Education',
    description: 'Unlock hidden features in Docs, Slides, and Sheets to streamline your workflow and enhance student collaboration.',
    presenter: 'IT Staff',
    room: 'Computer Lab 1',
    capacity: 30,
    enrolled: 10,
  },
  {
    id: 's2-3',
    slotId: 'slot-2',
    title: 'Culturally Responsive Teaching',
    description: 'Reflect on personal biases and learn how to build a curriculum that respects and represents the diverse backgrounds of our students.',
    presenter: 'Dr. Alan Smith',
    room: 'Room 112',
    capacity: 40,
    enrolled: 38,
  },
    {
    id: 's2-4',
    slotId: 'slot-2',
    title: 'Gamification Strategies for Engagement',
    description: 'Turn your lessons into quests. Learn how to use game design elements to motivate students and increase participation.',
    presenter: 'Chris Baker',
    room: 'Room 105',
    capacity: 25,
    enrolled: 25, // Full
  },

  // Slot 3
  {
    id: 's3-1',
    slotId: 'slot-3',
    title: 'Restorative Justice Circles',
    description: 'Training on how to facilitate restorative circles to build community and resolve conflicts within the classroom.',
    presenter: 'Counseling Dept',
    room: 'Room 202',
    capacity: 20,
    enrolled: 5,
  },
  {
    id: 's3-2',
    slotId: 'slot-3',
    title: 'STEM for Elementary Educators',
    description: 'Hands-on workshop providing simple, low-cost STEM activities that can be implemented in K-5 classrooms immediately.',
    presenter: 'Lisa Wong',
    room: 'Science Lab 3',
    capacity: 25,
    enrolled: 15,
  },
  {
    id: 's3-3',
    slotId: 'slot-3',
    title: 'Literacy Across the Curriculum',
    description: 'Strategies for non-ELA teachers to support reading and writing development in Science, Math, and Social Studies.',
    presenter: 'English Dept Head',
    room: 'Room 110',
    capacity: 35,
    enrolled: 30,
  },
];
