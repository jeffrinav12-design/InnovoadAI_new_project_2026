// ============================================================================
// 🏛️ SANKARA COLLEGE OF SCIENCE AND COMMERCE (AUTONOMOUS), COIMBATORE
// Affiliated to Bharathiar University | Approved by AICTE | NAAC Accredited 'A+'
// Comprehensive Academic Programs, Classes, Semesters & Curricula
// Covering: BSc, BCom streams with UG, PG, CSHM Hotel Management
// ============================================================================

export type CollegeLevel = 'UG' | 'PG';
export type CollegeStream = 'BSc' | 'BCom' | 'CSHM' | 'UG' | 'PG';

export interface SankaraSubject {
  code: string;
  name: string;
  category: 'Core' | 'Allied' | 'Elective' | 'Skill-Based' | 'Practical / Lab';
  credits: number;
  description: string;
  topics: string[];
}

export interface SankaraClassProgram {
  id: string;
  name: string;
  shortName: string;
  level: CollegeLevel;
  stream: CollegeStream;
  department: string;
  durationYears: number;
  totalSemesters: number;
  description: string;
  badgeColor?: string;
  semesters: Record<number, SankaraSubject[]>;
}

export interface ActiveClassSelection {
  programId: string;
  programName: string;
  shortName: string;
  level: CollegeLevel;
  stream: CollegeStream;
  year: number;
  semester: number;
  subjectCode: string;
  subjectName: string;
  category?: string;
  topics?: string[];
}

export const SANKARA_COLLEGE_INFO = {
  name: 'Sankara College of Science and Commerce',
  shortName: 'SCSC Coimbatore',
  affiliation: 'Autonomous • Affiliated to Bharathiar University',
  accreditation: 'Approved by AICTE, New Delhi | Re-accredited with NAAC "A+" Grade',
  location: 'Saravanampatty, Coimbatore - 641 035, Tamil Nadu',
  website: 'https://sankara.ac.in',
  established: 1991,
};

export const SANKARA_PROGRAMS: SankaraClassProgram[] = [
  // ==========================================================================
  // 🎓 B.SC. STREAMS (UG)
  // ==========================================================================
  {
    id: 'bsc-cs',
    name: 'B.Sc. Computer Science',
    shortName: 'B.Sc CS',
    level: 'UG',
    stream: 'BSc',
    department: 'Department of Computer Science',
    durationYears: 3,
    totalSemesters: 6,
    description: 'Comprehensive undergraduate programme covering core computing, algorithms, systems, software engineering, and artificial intelligence.',
    badgeColor: 'blue',
    semesters: {
      1: [
        {
          code: '21CSC101',
          name: 'Programming in C',
          category: 'Core',
          credits: 4,
          description: 'C tokens, control structures, arrays, strings, functions, pointers, dynamic memory allocation, and file processing.',
          topics: ['C Syntax & Control Structures', 'Arrays & String Operations', 'Functions & Recursion', 'Pointers & Dynamic Memory', 'File Handling & Preprocessors'],
        },
        {
          code: '21CSC102',
          name: 'Digital Fundamentals & Computer Architecture',
          category: 'Core',
          credits: 4,
          description: 'Binary number systems, Boolean algebra, logic gates, combinational and sequential circuits, CPU design and memory organization.',
          topics: ['Boolean Algebra & Karnaugh Maps', 'Combinational Logic: Adders & Multiplexers', 'Sequential Circuits: Flip-Flops & Counters', 'CPU Register Transfer & Instruction Cycle', 'Memory Hierarchy & Cache Memory'],
        },
        {
          code: '21CSMA101',
          name: 'Allied Mathematics I (Discrete Mathematics)',
          category: 'Allied',
          credits: 3,
          description: 'Set theory, mathematical logic, recurrence relations, graph theory, and matrix algebra for computer science.',
          topics: ['Propositional & Predicate Logic', 'Set Theory & Relations', 'Recurrence Relations & Generating Functions', 'Graph Theory & Tree Traversals', 'Matrix Eigenvalues & Cayley-Hamilton'],
        },
        {
          code: '21CSCP101',
          name: 'Programming in C Lab',
          category: 'Practical / Lab',
          credits: 2,
          description: 'Hands-on practical programming exercises implementing standard algorithms and data manipulation in C.',
          topics: ['Control Flow Exercises', 'Matrix Manipulations', 'Pointer Arithmetic', 'Linked List implementation in C', 'File Operations'],
        },
      ],
      2: [
        {
          code: '21CSC201',
          name: 'Object Oriented Programming with C++',
          category: 'Core',
          credits: 4,
          description: 'Object-oriented paradigms, classes, inheritance, polymorphism, templates, virtual functions, and STL in C++.',
          topics: ['OOP Concepts & Encapsulation', 'Constructors & Destructors', 'Inheritance & Virtual Functions', 'Operator Overloading & Polymorphism', 'C++ Templates & Standard Template Library (STL)'],
        },
        {
          code: '21CSC202',
          name: 'Data Structures & Algorithms',
          category: 'Core',
          credits: 4,
          description: 'Linear and non-linear data structures: stacks, queues, linked lists, trees, graphs, sorting, searching, and complexity analysis.',
          topics: ['Stack & Queue Operations & Applications', 'Singly & Doubly Linked Lists', 'Binary Search Trees & AVL Trees', 'Graph Representations, BFS & DFS', 'Sorting Algorithms & Asymptotic Notations'],
        },
        {
          code: '21CSMA201',
          name: 'Allied Mathematics II (Numerical & Statistical Methods)',
          category: 'Allied',
          credits: 3,
          description: 'Numerical solutions of algebraic equations, interpolation, numerical integration, probability distributions, and testing of hypothesis.',
          topics: ['Newton-Raphson & Gauss Elimination', 'Lagrange & Newton Interpolation', 'Trapezoidal & Simpson Rules', 'Probability Distributions (Binomial, Poisson, Normal)', 'Student t-test & Chi-Square Test'],
        },
        {
          code: '21CSCP201',
          name: 'Data Structures using C++ Lab',
          category: 'Practical / Lab',
          credits: 2,
          description: 'Laboratory experiments implementing data structures and sorting algorithms using modern C++.',
          topics: ['Stack & Infix to Postfix Conversion', 'Queue Implementations', 'BST Insert & Delete', 'Graph Traversal Algorithms', 'QuickSort and MergeSort Implementations'],
        },
      ],
      3: [
        {
          code: '21CSC301',
          name: 'Java Programming',
          category: 'Core',
          credits: 4,
          description: 'Java language syntax, JVM, multithreading, exception handling, Java Collection Framework, Swing GUI, and JDBC connectivity.',
          topics: ['Java OOP Concepts & Interfaces', 'Exception Handling & Custom Exceptions', 'Multithreading & Thread Synchronization', 'Collections: List, Set, Map', 'JDBC Database Connectivity & Swing'],
        },
        {
          code: '21CSC302',
          name: 'Relational Database Management Systems (RDBMS)',
          category: 'Core',
          credits: 4,
          description: 'Relational model, SQL, normalization (1NF-BCNF), transaction management, ACID properties, indexing, and PL/SQL procedures.',
          topics: ['ER Modeling & Relational Schema', 'SQL Queries, Joins & Subqueries', 'Database Normalization (1NF to BCNF)', 'ACID Properties & Concurrency Control', 'PL/SQL Triggers, Cursors & Stored Procedures'],
        },
        {
          code: '21CSC303',
          name: 'Operating Systems Principles',
          category: 'Core',
          credits: 3,
          description: 'Processes, CPU scheduling algorithms, process synchronization, semaphores, deadlock management, memory management, and paging.',
          topics: ['Process States & CPU Scheduling (Round Robin, SJF)', 'Process Synchronization & Semaphores', 'Deadlock Detection & Banker\'s Algorithm', 'Virtual Memory, Demand Paging & Page Replacement', 'Linux File System Architecture'],
        },
        {
          code: '21CSCP301',
          name: 'Java & RDBMS Lab',
          category: 'Practical / Lab',
          credits: 2,
          description: 'Building CRUD database applications connecting Java frontend with MySQL/Oracle database backend.',
          topics: ['Java OOP & Collections Exercises', 'SQL DDL, DML & Complex Joins', 'PL/SQL Trigger Writing', 'JDBC End-to-End Application Development'],
        },
      ],
      4: [
        {
          code: '21CSC401',
          name: 'Python Programming',
          category: 'Core',
          credits: 4,
          description: 'Python syntax, control flow, data structures (lists, tuples, dicts), file I/O, OOP, NumPy, Pandas, and Matplotlib data analytics.',
          topics: ['Python Data Types & Comprehensions', 'Functions, Lambdas & Modules', 'OOP in Python & Exception Handling', 'NumPy Arrays & Mathematical Operations', 'Pandas DataFrame Analysis & Matplotlib Plots'],
        },
        {
          code: '21CSC402',
          name: 'Computer Networks',
          category: 'Core',
          credits: 4,
          description: 'OSI and TCP/IP protocol stacks, physical layer, data link layer framing and error detection, network layer routing, IP addressing, transport protocols, and application layer.',
          topics: ['OSI 7-Layer vs TCP/IP Protocol Model', 'Error Detection (CRC) & Data Link Protocols', 'IPv4 & IPv6 Addressing, Subnetting & CIDR', 'Routing Protocols: OSPF, BGP, Distance Vector', 'TCP Congestion Control, UDP & DNS/HTTP'],
        },
        {
          code: '21CSC403',
          name: 'Software Engineering & Agile Methodologies',
          category: 'Core',
          credits: 3,
          description: 'Software development life cycles, Agile Scrum, requirements analysis, UML modeling, software testing techniques, and maintenance.',
          topics: ['Waterfall, Spiral & Agile Scrum Frameworks', 'Requirements Engineering & SRS Documentation', 'UML Use Case, Class & Sequence Diagrams', 'Black-Box & White-Box Testing Techniques', 'Software Quality Assurance & Metrics'],
        },
        {
          code: '21CSCP401',
          name: 'Python & Network Programming Lab',
          category: 'Practical / Lab',
          credits: 2,
          description: 'Python scripting, socket programming, client-server models, and data exploration.',
          topics: ['Python File & Data Structure Scripts', 'Socket Programming: TCP Client-Server', 'Web Scraping & API Data Fetching', 'Pandas Data Cleaning Experiments'],
        },
      ],
      5: [
        {
          code: '21CSC501',
          name: 'Web Technologies (HTML5, CSS3, JS & PHP)',
          category: 'Core',
          credits: 4,
          description: 'Frontend web architecture, modern HTML5, responsive CSS3 Grid & Flexbox, JavaScript DOM manipulation, asynchronous AJAX, and PHP server scripting.',
          topics: ['Semantic HTML5 & Modern CSS3 Flexbox/Grid', 'JavaScript ES6+, DOM Manipulation & Events', 'AJAX, Fetch API & JSON Data Handling', 'PHP Server-side Scripting & Sessions', 'Full-stack Web Integration with MySQL'],
        },
        {
          code: '21CSC502',
          name: 'Artificial Intelligence & Machine Learning',
          category: 'Core',
          credits: 4,
          description: 'Foundations of AI, search algorithms (A*, Minimax), knowledge representation, supervised and unsupervised learning, regression, classification, clustering, and neural networks.',
          topics: ['Heuristic Search: A*, Greedy Best First & Minimax', 'Propositional & First Order Predicate Logic', 'Supervised Learning: Linear Regression, Decision Trees, SVM', 'Unsupervised Learning: K-Means & Hierarchical Clustering', 'Artificial Neural Networks & Backpropagation'],
        },
        {
          code: '21CSC503',
          name: 'Cryptography & Network Security',
          category: 'Elective',
          credits: 3,
          description: 'Classical ciphers, symmetric cryptography (DES, AES), asymmetric cryptography (RSA, ECC), hash functions (SHA-256), digital signatures, and firewalls.',
          topics: ['Classical Ciphers & Mathematics of Cryptography', 'Symmetric Encryption: DES & AES Architectures', 'Asymmetric Key Cryptography: RSA & Diffie-Hellman', 'Digital Signatures, Hash Functions & Message Authentication', 'Firewalls, IDS/IPS & Network Defense'],
        },
        {
          code: '21CSC504',
          name: 'Mobile Application Development (Android)',
          category: 'Elective',
          credits: 3,
          description: 'Android architecture, activities, intents, UI layouts, fragments, SQLite database integration, background services, and APK publishing.',
          topics: ['Android Architecture & Activity Lifecycle', 'UI Layouts, Views & Event Handlers', 'Intents, Fragments & Navigation', 'SQLite Database Storage & Room DB', 'REST API Integration & App Publishing'],
        },
      ],
      6: [
        {
          code: '21CSC601',
          name: 'Cloud Computing & Virtualization',
          category: 'Core',
          credits: 4,
          description: 'Cloud service models (IaaS, PaaS, SaaS), deployment architectures, hypervisors, containerization (Docker, Kubernetes), AWS/GCP cloud services, and security.',
          topics: ['Cloud Architecture: IaaS, PaaS, SaaS Overview', 'Hypervisors, Hardware Virtualization & Containerization', 'Docker Containers & Kubernetes Orchestration', 'AWS / GCP Core Services: EC2, S3, IAM, Lambda', 'Cloud Security, SLA & Disaster Recovery'],
        },
        {
          code: '21CSC602',
          name: 'Big Data Analytics & Apache Hadoop',
          category: 'Core',
          credits: 4,
          description: 'Big data 5Vs, Hadoop Distributed File System (HDFS), MapReduce programming model, Apache Spark, NoSQL databases (MongoDB), and stream processing.',
          topics: ['Characteristics of Big Data (Volume, Velocity, Variety)', 'HDFS Architecture & NameNode/DataNode Operations', 'MapReduce Processing Paradigm', 'Apache Spark Resilient Distributed Datasets (RDD)', 'NoSQL Architecture & MongoDB CRUD Operations'],
        },
        {
          code: '21CSC603',
          name: 'Internet of Things (IoT) & Embedded Systems',
          category: 'Elective',
          credits: 3,
          description: 'IoT architecture, sensors, microcontrollers (Arduino, Raspberry Pi), MQTT and CoAP protocols, cloud integration, and smart campus applications.',
          topics: ['IoT Physical Design & Logical Architecture', 'Sensors, Actuators & Interfacing (Arduino/ESP32)', 'Communication Protocols: MQTT, CoAP, HTTP', 'Cloud IoT Platforms & Data Streaming', 'Smart City & Smart Agriculture Applications'],
        },
        {
          code: '21CSCP601',
          name: 'Capstone Industry Project & Viva Voce',
          category: 'Core',
          credits: 6,
          description: 'End-to-end full stack / AI / IoT system design, implementation, documentation, testing, and institutional defense.',
          topics: ['System Requirements Specification', 'Architectural Design & Database Schema', 'Full Implementation & Code Optimization', 'Unit & System Testing Procedures', 'Project Thesis Submission & Presentation'],
        },
      ],
    },
  },

  // ==========================================================================
  // 🏨 CSHM - CATERING SCIENCE & HOTEL MANAGEMENT (UG & DIPLOMA)
  // Flagship Department of Sankara College with specialized culinary labs & suites
  // ==========================================================================
  {
    id: 'bsc-cshm',
    name: 'B.Sc. Catering Science and Hotel Management (CSHM)',
    shortName: 'B.Sc CSHM',
    level: 'UG',
    stream: 'CSHM',
    department: 'Department of Catering Science & Hotel Management',
    durationYears: 3,
    totalSemesters: 6,
    description: 'Premier hotel management course featuring international culinary arts, food & beverage service, front office management, housekeeping operations, and hospitality business administration.',
    badgeColor: 'amber',
    semesters: {
      1: [
        {
          code: '21CSHM101',
          name: 'Food Production & Patisserie I (Culinary Fundamentals)',
          category: 'Core',
          credits: 4,
          description: 'Kitchen organization, culinary knife skills, cooking methods (boiling, poaching, roasting, baking), stocks, mother sauces, and soups.',
          topics: ['Kitchen Brigade & Hierarchy', 'Culinary Knives, Safety & Equipment', 'Basic Methods of Cooking', 'Stocks (White, Brown, Fish) & Soups', 'The 5 French Mother Sauces & Derivatives'],
        },
        {
          code: '21CSHM102',
          name: 'Food & Beverage Service I (Service Operations)',
          category: 'Core',
          credits: 4,
          description: 'Restaurant layout, tableware, glassware, cutlery, service styles (French, English, American, Russian, Buffet), and order-taking procedures.',
          topics: ['Food & Beverage Service Hierarchy', 'Crockery, Cutlery, Glassware & Table Linen', 'Service Styles & Table Layout Settings', 'Menu Classification: Table d\'hôte & À la carte', 'KOT (Kitchen Order Ticket) Procedures'],
        },
        {
          code: '21CSHM103',
          name: 'Front Office Operations I',
          category: 'Core',
          credits: 3,
          description: 'Front office organization, guest cycle (pre-arrival, arrival, occupancy, departure), reservation systems, check-in, and bell desk operations.',
          topics: ['Front Desk Hierarchy & Lobby Layout', 'The Complete Guest Cycle Stages', 'Reservation Systems & Channels (OTA, GDS)', 'Registration, Room Allocation & Key Handling', 'Bell Desk, Concierge & Luggage Handling'],
        },
        {
          code: '21CSHM104',
          name: 'Accommodation Operations (Housekeeping Basics)',
          category: 'Core',
          credits: 3,
          description: 'Housekeeping organization, cleaning agents, cleaning equipment, guest room layouts, bed making standards, and linen room management.',
          topics: ['Housekeeping Brigade & Coordination with Front Office', 'Classification of Cleaning Agents & Chemicals', 'Manual & Mechanical Cleaning Equipment', 'Standard Operating Procedure for Guest Room Cleaning', 'Linen Room Cycle, Par Stock & Uniform Management'],
        },
        {
          code: '21CSHMP101',
          name: 'Basic Food Production Practical Lab I',
          category: 'Practical / Lab',
          credits: 2,
          description: 'Practical culinary laboratory training on knife cuts, basic stocks, mother sauces, egg cookery, and 3-course continental menus.',
          topics: ['Julienne, Brunoise, Chiffonade Knife Cuts', 'Preparation of Béchamel, Velouté, Espagnole, Tomato & Hollandaise', 'Preparation of Consommé & Velouté Soups', 'Continental 3-Course Lunch Menus'],
        },
      ],
      2: [
        {
          code: '21CSHM201',
          name: 'Food Production & Culinary Arts II (Indian Regional Cuisine)',
          category: 'Core',
          credits: 4,
          description: 'Spices and condiments of India, regional culinary traditions (South Indian, Chettinad, Mughlai, Punjabi, Awadhi, Bengali, Goan), tandoor cooking.',
          topics: ['Spices, Masalas & Pastes of Indian Cuisine', 'South Indian & Tamil Culinary Specialties', 'Mughlai & Awadhi Dum Pukht Traditions', 'Tandoor Breads, Kebabs & Marinades', 'Indian Sweets & Traditional Desserts'],
        },
        {
          code: '21CSHM202',
          name: 'Food & Beverage Service II (Beverage Studies)',
          category: 'Core',
          credits: 4,
          description: 'Non-alcoholic beverages (tea, coffee, mocktails), alcoholic beverage classification, fermentation and distillation processes, viticulture, and wine service.',
          topics: ['Tea & Coffee Processing, Brewing & Service', 'Fermented Beverages: Beer Brewing & Service', 'Viticulture, Winemaking & Old vs New World Wines', 'Spirits: Whisky, Rum, Vodka, Gin, Tequila, Brandy', 'Wine & Food Harmony Principles'],
        },
        {
          code: '21CSHM203',
          name: 'Hotel Hygiene, Sanitation & HACCP',
          category: 'Allied',
          credits: 3,
          description: 'Food microbiology, contamination vectors, personal hygiene for food handlers, temperature danger zone, pest control, and HACCP standards.',
          topics: ['Foodborne Pathogens & Bacteria Control', 'Temperature Danger Zone (TDZ) Guidelines', 'Personal Hygiene & Medical Standards', 'HACCP 7 Principles in Hotel Kitchens', 'FSSAI Compliance & Inspection Guidelines'],
        },
        {
          code: '21CSHM204',
          name: 'Hospitality French & Communication',
          category: 'Allied',
          credits: 2,
          description: 'French culinary vocabulary, pronunciation of classic menu dishes, wines, greetings, and conversational French in fine dining.',
          topics: ['French Culinary Terminology & Menu Translations', 'Pronunciation of Wine Regions & Grape Varietals', 'Guest Welcoming Phrases in French', 'Classical French Culinary Vocabulary'],
        },
      ],
      3: [
        {
          code: '21CSHM301',
          name: 'Food Production III (Continental & International Cuisine)',
          category: 'Core',
          credits: 4,
          description: 'European culinary history, French classical menus, Italian pasta & risotto, Spanish tapas, Mediterranean, Mexican, and Far Eastern cuisines.',
          topics: ['Classic French Haute Cuisine Techniques', 'Italian Pasta, Sauces & Risotto Traditions', 'Far Eastern: Chinese Wok Cooking & Thai Curries', 'Mediterranean & Middle Eastern Mezze', 'International Charcuterie & Garde Manger Basics'],
        },
        {
          code: '21CSHM302',
          name: 'Food & Beverage Service III (Bar Operations & Mixology)',
          category: 'Core',
          credits: 4,
          description: 'Bar design, bar equipment, cocktail mixology, classic cocktails, liqueur classifications, tobacco, cigars, and responsible alcohol service.',
          topics: ['Bar Design, Layout & Speed Rails', 'Mixology Techniques: Shaking, Stirring, Layering', 'Classic Cocktails (Martini, Mojito, Old Fashioned, Margarita)', 'Liqueurs, Bitters & Aperitifs', 'Excise Regulations & Responsible Alcohol Service'],
        },
        {
          code: '21CSHM303',
          name: 'Hotel Accounting & Financial Controls',
          category: 'Core',
          credits: 3,
          description: 'Uniform system of accounts for hotels (USALI), night audit, food costing, beverage costing, yield management, and REVPAR metrics.',
          topics: ['Uniform System of Accounts for Lodging (USALI)', 'Night Audit Duties & Shift Balances', 'Food Cost Percentage & Yield Tests', 'Menu Engineering: Stars, Plowhorses, Puzzles, Dogs', 'Hotel Key Metrics: ADR, RevPAR, Occupancy Rate'],
        },
        {
          code: '21CSHM304',
          name: 'Hospitality Marketing & Public Relations',
          category: 'Core',
          credits: 3,
          description: 'Hospitality 7Ps marketing mix, digital hotel marketing, OTAs (Booking.com, MakeMyTrip), customer loyalty programs, and PR strategies.',
          topics: ['7Ps of Service Marketing in Hospitality', 'OTA Commission Structures & Direct Booking Strategies', 'Hotel Brand Positioning & Loyalty Programs', 'Social Media Marketing & Review Management', 'Corporate Sales & Group Booking Negotiation'],
        },
      ],
      4: [
        {
          code: '21CSHM401',
          name: 'Food Production IV (Quantity Food Production & Catering)',
          category: 'Core',
          credits: 4,
          description: 'Institutional catering, banquet production, volume forecasting, industrial canteens, cruise line catering, airline catering, and menu planning.',
          topics: ['Volume Cooking Principles & Batch Production', 'Industrial & Institutional Canteen Management', 'Airline, Railway & Offshore Catering Standards', 'Menu Planning for 1000+ Guests Banquets', 'Standard Recipe Cards & Production Scheduling'],
        },
        {
          code: '21CSHM402',
          name: 'Food & Beverage Management',
          category: 'Core',
          credits: 4,
          description: 'F&B budget forecasting, purchasing systems, receiving, storing and issuing controls, beverage stocktaking, and labor scheduling.',
          topics: ['F&B Budgeting & Sales Forecasting', 'Purchasing Specifications & Vendor Management', 'Stores Management, Bin Cards & Perpetual Inventory', 'Beverage Cellar Controls & Par Stocking', 'Staff Rostering & Labor Cost Optimization'],
        },
        {
          code: '21CSHM403',
          name: 'Front Office Management & Revenue Strategy',
          category: 'Core',
          credits: 3,
          description: 'Dynamic pricing, revenue management, overbooking strategies, guest relation management, and crisis management in hotels.',
          topics: ['Dynamic Room Pricing & Rate Parity', 'Overbooking Calculations & Walk-in Handling', 'Guest Relationship Management & VIP Protocols', 'Crisis Protocols: Fire, Medical Emergencies & Evacuation', 'Property Management Systems (Opera / Fidelio)'],
        },
        {
          code: '21CSHM404',
          name: 'Hotel Laws & Industrial Regulations',
          category: 'Allied',
          credits: 3,
          description: 'Innkeeper rights and duties, liquor licensing, food safety laws, labor laws (Factories Act, ESI, PF), and guest privacy legalities.',
          topics: ['Innkeeper Rights, Duties & Lien on Guest Luggage', 'Liquor Licensing & Excise Compliance Laws', 'Food Safety and Standards Act (FSSAI)', 'Labor Legislation: Payment of Wages, Gratuity, PF', 'Guest Privacy Rights & Cyber Laws for Hotels'],
        },
      ],
      5: [
        {
          code: '21CSHM501',
          name: 'Bakery & Confectionery Science',
          category: 'Core',
          credits: 4,
          description: 'Baking ingredients science, yeast breads, sourdoughs, pastries (puff, shortcrust, choux), cakes, chocolates, icing, and sugar artistry.',
          topics: ['Flour Gluten Chemistry & Yeast Fermentation', 'Artisan Breads: Baguettes, Croissants, Brioche', 'Laminated Doughs: Puff Pastry & Danish Pastries', 'Cakes, Icings (Fondant, Ganache) & Gateaux', 'Chocolate Tempering & Confectionery Displays'],
        },
        {
          code: '21CSHM502',
          name: 'Facility Planning & Hotel Engineering',
          category: 'Core',
          credits: 4,
          description: 'Hotel architectural design, kitchen layout planning, workflow ergonomics, HVAC systems, energy management, and fire safety systems.',
          topics: ['Hotel Architectural Planning & Flow of Work', 'Commercial Kitchen Equipment Planning & Ergonomics', 'HVAC (Heating, Ventilation & Air Conditioning)', 'Green Hotels & Sustainable Energy Auditing', 'Fire Suppression Systems & Water Treatment Plants'],
        },
        {
          code: '21CSHM503',
          name: 'Human Resource Management in Hospitality',
          category: 'Elective',
          credits: 3,
          description: 'Recruitment in hospitality, training and development, motivation, attrition management, labor union relations, and performance appraisals.',
          topics: ['Hospitality Workforce Planning & Job Descriptions', 'Executive Chef & General Manager Selection', 'Staff Training Modules & Grooming Standards', 'Employee Retention Strategies in 24/7 Hotels', 'Performance Appraisal & 360-Degree Feedback'],
        },
        {
          code: '21CSHM504',
          name: 'Tourism Management & Heritage Studies',
          category: 'Elective',
          credits: 3,
          description: 'Tourism industry overview, tour packaging, travel agencies, eco-tourism, cultural heritage tourism in Tamil Nadu, and passport/visa protocols.',
          topics: ['Tourism Components (4As: Attractions, Access, Amenities, Ancillaries)', 'Tour Operator Roles & Itinerary Planning', 'Heritage & Cultural Tourism in South India', 'Eco-Tourism & Sustainable Destination Management', 'IATA Regulations, Passports, Visas & Travel Insurance'],
        },
      ],
      6: [
        {
          code: '21CSHM601',
          name: 'Banquet & Convention Management',
          category: 'Core',
          credits: 4,
          description: 'MICE (Meetings, Incentives, Conferences, Exhibitions), banquet sales, event logistics, contract negotiation, and VIP protocol management.',
          topics: ['MICE Industry Dynamics & Global Market', 'Banquet Event Orders (BEO) & Seating Layouts', 'Audio-Visual Technology for Conventions', 'Budgeting & Cost Control for Luxury Weddings', 'VIP Protocols, Security & Diplomatic Banquets'],
        },
        {
          code: '21CSHM602',
          name: 'Hospitality Entrepreneurship & Strategic Management',
          category: 'Core',
          credits: 4,
          description: 'Starting a restaurant / cloud kitchen / boutique resort, business feasibility study, capital raising, FSSAI licensing, and strategic leadership.',
          topics: ['Feasibility Study for Food Ventures & Cloud Kitchens', 'Licenses Required to Start a Hotel/Restaurant in India', 'Hospitality Business Models & Franchise Agreements', 'Competitive Advantage & Porter\'s 5 Forces in Hospitality', 'Strategic Turnarounds for Struggling Properties'],
        },
        {
          code: '21CSHMP601',
          name: '20-Week Industrial Exposure Training (IET) & Defense',
          category: 'Practical / Lab',
          credits: 6,
          description: 'Full-time five-star hotel departmental training rotation in Food Production, F&B Service, Front Office, and Housekeeping with industrial logbook.',
          topics: ['Five-Star Hotel Food Production Department Rotation', 'Food & Beverage Service Fine Dining Exposure', 'Front Office Shift Operations & Guest Relations', 'Housekeeping Executive Floor Management', 'Comprehensive Industrial Viva Voce Defense'],
        },
      ],
    },
  },

  // ==========================================================================
  // 💼 B.COM. STREAMS (UG)
  // ==========================================================================
  {
    id: 'bcom-gen',
    name: 'B.Com. (General / Corporate)',
    shortName: 'B.Com General',
    level: 'UG',
    stream: 'BCom',
    department: 'Department of Commerce',
    durationYears: 3,
    totalSemesters: 6,
    description: 'Flagship undergraduate commerce program providing in-depth training in accounting, finance, banking, business laws, taxation, and company administration.',
    badgeColor: 'emerald',
    semesters: {
      1: [
        {
          code: '21COMC101',
          name: 'Financial Accounting I',
          category: 'Core',
          credits: 4,
          description: 'Accounting principles, journal, ledger, trial balance, bank reconciliation statement, depreciation accounting, and final accounts of sole traders.',
          topics: ['Accounting Concepts & Double Entry System', 'Journal Entries, Ledger Posting & Trial Balance', 'Bank Reconciliation Statement (BRS)', 'Depreciation Methods: SLM, WDV, Annuity', 'Final Accounts of Sole Proprietary Concerns with Adjustments'],
        },
        {
          code: '21COMC102',
          name: 'Business Organization & Office Management',
          category: 'Core',
          credits: 4,
          description: 'Forms of business organization (sole trader, partnership, joint stock company, cooperatives), business ethics, office layout, and filing systems.',
          topics: ['Sole Proprietorship, Partnership & LLP', 'Joint Stock Company Formation & Promoters', 'Modern Office Management & Ergonomics', 'Office Filing Systems & Record Management', 'Business Ethics & Corporate Citizenship'],
        },
        {
          code: '21COMA101',
          name: 'Business Economics',
          category: 'Allied',
          credits: 3,
          description: 'Law of demand, elasticity of demand, consumer surplus, production functions, cost concepts, and market structures (perfect competition, monopoly, oligopoly).',
          topics: ['Demand Analysis & Elasticity Calculations', 'Indifference Curves & Consumer Equilibrium', 'Cobb-Douglas Production Function & Laws of Returns', 'Cost-Output Relationship & Economies of Scale', 'Pricing under Monopoly & Monopolistic Competition'],
        },
      ],
      2: [
        {
          code: '21COMC201',
          name: 'Financial Accounting II',
          category: 'Core',
          credits: 4,
          description: 'Branch accounts, departmental accounts, hire purchase and installment purchase systems, partnership accounts (admission, retirement, death, dissolution).',
          topics: ['Branch Accounts: Dependent & Independent Branches', 'Departmental Accounting & Expense Allocation', 'Hire Purchase vs Installment Purchase Systems', 'Partnership: Goodwill Treatment on Admission', 'Retirement & Dissolution of Partnership Firms'],
        },
        {
          code: '21COMC202',
          name: 'Business Communication & Secretarial Practice',
          category: 'Core',
          credits: 4,
          description: 'Effective commercial correspondence, sales letters, collection letters, enquiry letters, meeting notices, agendas, minutes, and company secretary duties.',
          topics: ['Principles of Effective Business Writing', 'Enquiry, Quotation & Order Letters', 'Collection & Persuasion Communication', 'Meeting Notices, Agenda & Minutes Drafting', 'Duties & Legal Position of Company Secretary'],
        },
        {
          code: '21COMA201',
          name: 'Business Mathematics & Statistics I',
          category: 'Allied',
          credits: 3,
          description: 'Matrix algebra, simple and compound interest, annuities, collection of data, measures of central tendency, and dispersion.',
          topics: ['Matrices & Determinants for Business Analysis', 'Compound Interest, EMI & Annuity Calculations', 'Measures of Central Tendency: Mean, Median, Mode', 'Measures of Dispersion: Standard Deviation & Variance', 'Skewness & Kurtosis in Business Data'],
        },
      ],
      3: [
        {
          code: '21COMC301',
          name: 'Corporate Accounting I',
          category: 'Core',
          credits: 4,
          description: 'Issue and forfeiture of shares, redemption of preference shares, issue and redemption of debentures, underwriting of shares, and company final accounts.',
          topics: ['Issue of Shares at Par, Premium & Discount', 'Forfeiture & Re-issue of Shares', 'Redemption of Redeemable Preference Shares', 'Issue & Redemption of Debentures & Sinking Fund', 'Preparation of Company Final Accounts as per Schedule III'],
        },
        {
          code: '21COMC302',
          name: 'Business Law (Mercantile Law)',
          category: 'Core',
          credits: 4,
          description: 'Indian Contract Act 1872, offer, acceptance, consideration, free consent, discharge of contract, breach of contract, contract of indemnity and guarantee, Sale of Goods Act.',
          topics: ['Indian Contract Act 1872: Essentials of Valid Contract', 'Offer, Acceptance, Consideration & Legality', 'Free Consent: Coercion, Undue Influence, Fraud', 'Discharge & Remedies for Breach of Contract', 'Sale of Goods Act 1930: Conditions & Warranties'],
        },
        {
          code: '21COMC303',
          name: 'Banking Theory, Law & Practice',
          category: 'Core',
          credits: 4,
          description: 'Central banking (RBI), monetary policy, commercial banks, banker-customer relationship, negotiable instruments (cheques, bills), and digital banking (NEFT, RTGS, UPI).',
          topics: ['RBI Functions, Monetary Policy & Repo Rates', 'Banker-Customer Relationship & Banker\'s Lien', 'Negotiable Instruments Act: Cheques, Endorsements', 'Crossing of Cheques & Paying Banker Protection', 'Digital Banking Innovations: IMPS, UPI, Net Banking'],
        },
      ],
      4: [
        {
          code: '21COMC401',
          name: 'Corporate Accounting II',
          category: 'Core',
          credits: 4,
          description: 'Valuation of goodwill and shares, amalgamation, absorption and external reconstruction (AS-14), liquidation of companies, and banking company accounts.',
          topics: ['Methods of Valuation of Goodwill', 'Valuation of Equity & Preference Shares', 'Amalgamation & Absorption Accounting (AS-14)', 'Liquidation of Companies: Liquidator\'s Final Statement', 'Preparation of Banking Company Financial Statements'],
        },
        {
          code: '21COMC402',
          name: 'Company Law & Secretarial Practice',
          category: 'Core',
          credits: 4,
          description: 'Companies Act 2013, Memorandum & Articles of Association, prospectus, board of directors, corporate meetings, resolutions, and corporate governance.',
          topics: ['Companies Act 2013: Characteristics & Types of Companies', 'Memorandum (MOA) & Articles of Association (AOA)', 'Prospectus & Allotment of Securities', 'Directors: Appointment, Powers, Duties & Remuneration', 'Corporate Governance & Annual General Meetings (AGM)'],
        },
        {
          code: '21COMC403',
          name: 'Cost Accounting',
          category: 'Core',
          credits: 4,
          description: 'Cost concepts, cost sheet preparation, material control (EOQ, ABC), labor costing (incentive plans), overhead allocation, apportionment, and process costing.',
          topics: ['Cost Sheet Preparation & Classification of Costs', 'Material Control: EOQ, Re-order Levels & ABC Analysis', 'Labor Costing: Halsey, Rowan & Taylor Incentive Plans', 'Overhead Allocation, Apportionment & Absorption', 'Process Costing & Normal/Abnormal Losses'],
        },
      ],
      5: [
        {
          code: '21COMC501',
          name: 'Income Tax Law & Practice I',
          category: 'Core',
          credits: 4,
          description: 'Income Tax Act 1961, residential status, exempted incomes, computation of income under Salary, Income from House Property, and Profits and Gains of Business or Profession (PGBP).',
          topics: ['Basic Concepts, Assessment Year & Residential Status', 'Computation of Income from Salaries & Allowances', 'Income from House Property (Annual Value Calculations)', 'Profits and Gains of Business or Profession (PGBP)', 'Allowable & Disallowable Business Deductions'],
        },
        {
          code: '21COMC502',
          name: 'Auditing & Assurance Standards',
          category: 'Core',
          credits: 4,
          description: 'Nature and objectives of auditing, audit planning, internal control, vouching of cash and credit transactions, verification and valuation of assets and liabilities, and auditor report.',
          topics: ['Objectives of Audit, Independence & Ethics', 'Internal Control, Internal Check & Audit Programs', 'Vouching of Cash Receipts, Payments & Purchases', 'Verification & Valuation of Fixed Assets & Current Assets', 'Qualifications, Rights & Liabilities of Statutory Auditors'],
        },
        {
          code: '21COMC503',
          name: 'Financial Management',
          category: 'Core',
          credits: 4,
          description: 'Objectives of financial management, capital budgeting (NPV, IRR, Payback), cost of capital (WACC), capital structure theories (NI, NOI, MM), and dividend decisions.',
          topics: ['Wealth Maximization vs Profit Maximization', 'Capital Budgeting: Payback, NPV, IRR & PI', 'Cost of Capital (Ke, Kd, Kp & WACC)', 'Capital Structure: NI, NOI & Modigliani-Miller Approach', 'Working Capital Management & Cash Cycle'],
        },
      ],
      6: [
        {
          code: '21COMC601',
          name: 'Income Tax Law & Practice II',
          category: 'Core',
          credits: 4,
          description: 'Computation of capital gains, income from other sources, aggregation of income, set-off and carry forward of losses, deductions under Chapter VI-A (80C to 80U), and assessment of individuals.',
          topics: ['Computation of Short-Term & Long-Term Capital Gains', 'Income from Other Sources & Casual Incomes', 'Set-Off & Carry Forward of Losses Rules', 'Deductions under Section 80C to 80U', 'Computation of Total Income & Tax Liability of Individuals'],
        },
        {
          code: '21COMC602',
          name: 'Management Accounting',
          category: 'Core',
          credits: 4,
          description: 'Financial statement analysis, comparative statements, common size statements, ratio analysis (liquidity, profitability, solvency), fund flow statement, cash flow statement (AS-3), and marginal costing.',
          topics: ['Financial Statement Analysis: Comparative & Common Size', 'Ratio Analysis: Current, Quick, Debt-Equity, ROI, EPS', 'Cash Flow Statement as per AS-3 (Operating, Investing, Financing)', 'Marginal Costing, Break-Even Point (BEP) & P/V Ratio', 'Budgetary Control: Cash Budget & Flexible Budget'],
        },
        {
          code: '21COMC603',
          name: 'Goods and Services Tax (GST) & Customs Law',
          category: 'Core',
          credits: 4,
          description: 'GST framework in India (CGST, SGST, IGST), taxable event, levy and collection, supply of goods and services, input tax credit (ITC), registration, returns, and customs duty basics.',
          topics: ['Constitutional Framework & Concept of Dual GST', 'Concept of Supply: Section 7 & Mixed vs Composite Supplies', 'Input Tax Credit (ITC) Eligibility & Blocked Credits', 'GST Registration, Invoicing, E-Way Bill & Filing Returns', 'Basic Customs Duty, Valuation & Import Clearance'],
        },
      ],
    },
  },

  // ==========================================================================
  // 💻 B.COM. COMPUTER APPLICATIONS (B.COM CA)
  // ==========================================================================
  {
    id: 'bcom-ca',
    name: 'B.Com. Computer Applications (B.Com CA)',
    shortName: 'B.Com CA',
    level: 'UG',
    stream: 'BCom',
    department: 'Department of Commerce with Computer Applications',
    durationYears: 3,
    totalSemesters: 6,
    description: 'Blended commerce and technology programme integrating accounting principles with database design, business programming, e-commerce, and enterprise ERP systems.',
    badgeColor: 'teal',
    semesters: {
      1: [
        {
          code: '21BCA101',
          name: 'Financial Accounting I',
          category: 'Core',
          credits: 4,
          description: 'Foundations of accounting, double entry bookkeeping, trial balance, depreciation, and final accounts.',
          topics: ['Double Entry Accounting Principles', 'Journal & Ledger Postings', 'Trial Balance Preparation', 'Depreciation Methods', 'Trading, P&L Account and Balance Sheet'],
        },
        {
          code: '21BCA102',
          name: 'Information Technology & Office Automation',
          category: 'Core',
          credits: 4,
          description: 'Computer hardware, system software, word processing, advanced spreadsheets (Excel functions, VLOOKUP, pivot tables), and presentations.',
          topics: ['Computer Architecture & Operating Systems', 'Advanced MS Word Documents & Mail Merge', 'Excel Formulas: VLOOKUP, INDEX-MATCH & Pivot Tables', 'Data Filtering, Conditional Formatting & Charts', 'PowerPoint Business Presentations'],
        },
        {
          code: '21BCA103',
          name: 'Principles of Management',
          category: 'Allied',
          credits: 3,
          description: 'Planning, organizing, staffing, directing, controlling, decision-making, and organizational structures.',
          topics: ['Management Theories (Taylor, Fayol)', 'Planning Process & MBO (Management by Objectives)', 'Organizational Structures & Delegation of Authority', 'Leadership Styles & Motivation Theories', 'Controlling Techniques & Total Quality Management'],
        },
      ],
      2: [
        {
          code: '21BCA201',
          name: 'Financial Accounting II',
          category: 'Core',
          credits: 4,
          description: 'Partnership accounts, hire purchase, departmental and branch accounting.',
          topics: ['Admission & Retirement of Partners', 'Dissolution of Partnership Firms', 'Departmental Expense Apportionment', 'Dependent Branch Accounting', 'Hire Purchase Interest Calculations'],
        },
        {
          code: '21BCA202',
          name: 'Programming in C for Business Applications',
          category: 'Core',
          credits: 4,
          description: 'C programming syntax, data structures, strings, files, and payroll/inventory program logic.',
          topics: ['C Data Types, Operators & Conditions', 'Arrays for Tabular Financial Data', 'Functions & Modular Programming', 'Structures for Employee/Product Records', 'File Processing for Billing & Reports'],
        },
        {
          code: '21BCA203',
          name: 'Business Economics',
          category: 'Allied',
          credits: 3,
          description: 'Demand elasticity, production functions, market equilibrium, and inflation.',
          topics: ['Elasticity of Demand & Business Forecasting', 'Cost Curves & Revenue Analysis', 'Monopoly & Perfect Competition Markets', 'Inflation, GDP & National Income in India'],
        },
      ],
      3: [
        {
          code: '21BCA301',
          name: 'Corporate Accounting',
          category: 'Core',
          credits: 4,
          description: 'Issue and redemption of shares and debentures, company final accounts, and profit prior to incorporation.',
          topics: ['Issue & Forfeiture of Equity Shares', 'Redemption of Debentures', 'Profit Prior to Incorporation Calculations', 'Company Balance Sheet (Schedule III)', 'Managerial Remuneration Calculations'],
        },
        {
          code: '21BCA302',
          name: 'Database Management Systems & SQL for Business',
          category: 'Core',
          credits: 4,
          description: 'Relational data model, SQL queries, DDL, DML, joins, group by, constraints, and database design for commerce.',
          topics: ['Relational Model & Key Constraints', 'SQL Table Creation, Constraints & Foreign Keys', 'SQL DML: INSERT, UPDATE, DELETE & Transactions', 'Advanced SQL: Joins, Subqueries & Aggregate Functions', 'Creating Commerce Views, Indexes & Security'],
        },
        {
          code: '21BCA303',
          name: 'Business Law',
          category: 'Allied',
          credits: 3,
          description: 'Contract Act, Sale of Goods Act, and Consumer Protection Act.',
          topics: ['Indian Contract Act 1872 Core Provisions', 'Breach of Contract & Liquidated Damages', 'Sale of Goods Act: Conditions vs Warranties', 'Consumer Protection Act 2019 & E-Consumer Rights'],
        },
      ],
      4: [
        {
          code: '21BCA401',
          name: 'Cost & Management Accounting',
          category: 'Core',
          credits: 4,
          description: 'Cost sheets, inventory control, process costing, marginal costing, and break-even analysis.',
          topics: ['Cost Sheet Preparation & Overhead Distribution', 'EOQ, Maximum/Minimum Stock Levels', 'Process Costing & By-product Accounting', 'Marginal Costing, P/V Ratio & Break-Even Chart', 'Cash Budgeting & Flexible Budgets'],
        },
        {
          code: '21BCA402',
          name: 'Web Designing & E-Commerce Technologies',
          category: 'Core',
          credits: 4,
          description: 'HTML5, CSS3, JavaScript, electronic payment systems (Payment Gateways), B2B/B2C models, and online security.',
          topics: ['HTML5 & Responsive CSS3 Web Design', 'JavaScript for Client-Side Form Validation', 'E-Commerce Models: B2B, B2C, C2C & D2C', 'Digital Payment Gateways & UPI Infrastructure', 'Cyber Security, SSL/TLS & E-Commerce Law'],
        },
        {
          code: '21BCA403',
          name: 'Banking & Financial Services',
          category: 'Allied',
          credits: 3,
          description: 'Modern banking products, mutual funds, merchant banking, factoring, and credit rating.',
          topics: ['Commercial Bank Operations & KYC Norms', 'Mutual Fund Types & NAV Calculation', 'Merchant Banking & IPO Underwriting', 'Factoring, Forfaiting & Leasing Services', 'Credit Rating Agencies (CRISIL, ICRA)'],
        },
      ],
      5: [
        {
          code: '21BCA501',
          name: 'Income Tax Law & Practice',
          category: 'Core',
          credits: 4,
          description: 'Income heads: Salaries, House Property, PGBP, Capital Gains, deductions under 80C, and individual tax computation.',
          topics: ['Residential Status & Scope of Total Income', 'Computation of Income from Salaries', 'House Property & Business Profits (PGBP)', 'Capital Gains & Income from Other Sources', 'Tax Deductions under Chapter VI-A & Tax Rates'],
        },
        {
          code: '21BCA502',
          name: 'Computerized Accounting with Tally Prime & ERP',
          category: 'Core',
          credits: 4,
          description: 'Company creation in Tally Prime, voucher entry, inventory setup, GST invoicing, bank reconciliation, and financial reports.',
          topics: ['Company Creation & Group Ledgers in Tally Prime', 'Voucher Entry: Payment, Receipt, Sales, Purchase, Contra', 'Inventory Management: Units of Measure, Stock Groups', 'GST Invoicing, HSN Codes & GST Returns in Tally', 'Generating Balance Sheet, P&L & Cash Flow Reports'],
        },
        {
          code: '21BCA503',
          name: 'Auditing Principles & Cyber Law',
          category: 'Elective',
          credits: 3,
          description: 'Vouching, verification, internal control, Information Technology Act 2000, cyber crimes, and digital signatures.',
          topics: ['Audit Vouching & Internal Control Techniques', 'Verification & Valuation of Balance Sheet Items', 'IT Act 2000: Digital Signatures & Cyber Appellate Tribunal', 'Cyber Crimes, Data Theft & Penalties in Commerce'],
        },
      ],
      6: [
        {
          code: '21BCA601',
          name: 'Goods & Services Tax (GST) & Customs Practice',
          category: 'Core',
          credits: 4,
          description: 'GST law, levy and collection, Input Tax Credit, GST portal filings (GSTR-1, GSTR-3B), e-invoicing, and customs duty.',
          topics: ['Dual GST Structure (CGST, SGST, IGST)', 'Valuation of Supply & Input Tax Credit Rules', 'GSTR-1, GSTR-3B & Annual Return GSTR-9 Filing', 'E-Way Bill & E-Invoicing Mandates in India', 'Customs Tariffs, Import Documentation & Duty Computation'],
        },
        {
          code: '21BCA602',
          name: 'Python Programming for Business & Financial Analytics',
          category: 'Core',
          credits: 4,
          description: 'Python syntax, Pandas data manipulation, financial metrics calculation, stock data analysis, and automated business reporting.',
          topics: ['Python Fundamentals & File Processing', 'Pandas DataFrames for Accounting & Sales Records', 'Financial Ratios Computation via Python Scripts', 'Data Visualization: Sales Trends via Matplotlib & Seaborn', 'Automating Excel Financial Reports with OpenPyXL'],
        },
        {
          code: '21BCA603',
          name: 'Institutional Project & Commerce Software Viva',
          category: 'Core',
          credits: 6,
          description: 'Real-world business software implementation combining accounting and database or web applications.',
          topics: ['Business Problem Identification & Feasibility Study', 'System Design, Data Flow Diagrams & Schema', 'Implementation of Accounting or ERP Prototype', 'Testing, Documentation & User Manual', 'Institutional Defense & Viva Voce'],
        },
      ],
    },
  },

  // ==========================================================================
  // 🎓 POSTGRADUATE (PG) - M.SC. COMPUTER SCIENCE
  // ==========================================================================
  {
    id: 'msc-cs',
    name: 'M.Sc. Computer Science',
    shortName: 'M.Sc CS',
    level: 'PG',
    stream: 'PG',
    department: 'Department of Computer Science (PG)',
    durationYears: 2,
    totalSemesters: 4,
    description: 'Advanced postgraduate programme emphasizing advanced algorithms, machine learning, distributed computing, deep learning, cloud architecture, and academic research.',
    badgeColor: 'purple',
    semesters: {
      1: [
        {
          code: '21MCS101',
          name: 'Advanced Data Structures & Analysis of Algorithms',
          category: 'Core',
          credits: 4,
          description: 'Asymptotic complexity, amortized analysis, Fibonacci heaps, Red-Black trees, graph algorithms, dynamic programming, and NP-completeness.',
          topics: ['Amortized Analysis & Potential Method', 'Red-Black Trees, B-Trees & Splay Trees', 'Fibonacci Heaps & Disjoint Set Data Structures', 'Network Flow: Ford-Fulkerson & Maximum Bipartite Matching', 'NP-Completeness: Reduction Proofs & Approximation Algorithms'],
        },
        {
          code: '21MCS102',
          name: 'Advanced Java Programming & Distributed Systems',
          category: 'Core',
          credits: 4,
          description: 'Java concurrency, functional streams, Spring Boot microservices, REST APIs, Hibernate ORM, and RMI distributed architectures.',
          topics: ['Java 17+ Concurrency & ForkJoin Framework', 'Streams API & Functional Programming Patterns', 'Spring Boot Microservices & RESTful API Architecture', 'Hibernate ORM, JPA & Transactional Management', 'Remote Method Invocation (RMI) & Messaging Queues (Kafka)'],
        },
        {
          code: '21MCS103',
          name: 'Mathematical Foundations of Computer Science',
          category: 'Core',
          credits: 3,
          description: 'Probability models, Markov chains, linear algebra for ML, information theory, and graph theoretical modeling.',
          topics: ['Linear Transformations & Matrix Decompositions (SVD, PCA)', 'Probability Spaces & Bayes Theorem Extensions', 'Markov Chains & Transition Probability Matrices', 'Information Theory & Entropy Measures', 'Graph Spectral Theory & Applications'],
        },
      ],
      2: [
        {
          code: '21MCS201',
          name: 'Distributed Operating Systems & Virtualization',
          category: 'Core',
          credits: 4,
          description: 'Distributed synchronization, Lamport timestamps, distributed mutual exclusion, election algorithms, fault tolerance, and consensus.',
          topics: ['Distributed Systems Architecture & Network Operating Systems', 'Clock Synchronization & Lamport Logical Clocks', 'Distributed Mutual Exclusion (Ricart-Agrawala)', 'Consensus Protocols: Paxos & Raft Fundamentals', 'Distributed File Systems (NFS, GFS, HDFS)'],
        },
        {
          code: '21MCS202',
          name: 'Machine Learning & Pattern Recognition',
          category: 'Core',
          credits: 4,
          description: 'Statistical learning theory, support vector machines, kernel methods, ensemble learning (XGBoost, Random Forests), dimensionality reduction, and clustering.',
          topics: ['Statistical Learning Theory & PAC Learning', 'Support Vector Machines & Kernel Trick Mechanics', 'Ensemble Methods: AdaBoost, Random Forests, XGBoost', 'Dimensionality Reduction: PCA, t-SNE, UMAP', 'Expectation-Maximization (EM) & Gaussian Mixture Models'],
        },
        {
          code: '21MCS203',
          name: 'Advanced Database Systems & NoSQL',
          category: 'Core',
          credits: 3,
          description: 'Query optimization, distributed transactions (2PC, 3PC), NoSQL architectures (Key-Value, Document, Columnar, Graph), and CAP theorem.',
          topics: ['Relational Query Execution Plans & Cost-Based Optimizers', 'Distributed Transactions & Two-Phase Commit (2PC)', 'CAP Theorem & Eventual Consistency Models', 'MongoDB Document Storage & Sharding Strategies', 'Graph Databases: Neo4j & Cypher Query Language'],
        },
      ],
      3: [
        {
          code: '21MCS301',
          name: 'Deep Learning & Computer Vision',
          category: 'Core',
          credits: 4,
          description: 'Convolutional neural networks, ResNet, object detection (YOLO), recurrent architectures, attention mechanisms, transformers, and vision transformers.',
          topics: ['Convolution Operations, ResNet, DenseNet Architectures', 'Object Detection Pipelines: R-CNN, Fast R-CNN, YOLO', 'Recurrent Neural Networks, GRU & LSTM Mechanisms', 'Transformers Architecture & Multi-Head Self-Attention', 'Generative Adversarial Networks (GANs) & Diffusion Models'],
        },
        {
          code: '21MCS302',
          name: 'Cloud Computing Architecture & Microservices',
          category: 'Core',
          credits: 4,
          description: 'Cloud design patterns, microservices decomposition, API gateways, Kubernetes orchestration, serverless computing, and cloud security.',
          topics: ['Cloud Native Architecture & 12-Factor App Methodology', 'Domain-Driven Design (DDD) & Microservice Boundaries', 'API Gateways, Service Discovery & Circuit Breakers', 'Kubernetes Deployment, StatefulSets & Pod Networking', 'Serverless Functions (AWS Lambda) & Event-Driven Systems'],
        },
        {
          code: '21MCS303',
          name: 'Research Methodology & Technical Paper Writing',
          category: 'Core',
          credits: 3,
          description: 'Literature review techniques, identifying research gaps, experimental design, statistical validation, LaTeX authoring, and IEEE citation standards.',
          topics: ['Research Problem Formulation & Literature Survey', 'Experimental Design & Statistical Significance Testing', 'LaTeX Document Typesetting & Equation Formatting', 'Research Ethics, Plagiarism Detection & Peer Review', 'Scopus / IEEE Conference Submission Standards'],
        },
      ],
      4: [
        {
          code: '21MCS401',
          name: 'Big Data Analytics with Apache Spark',
          category: 'Core',
          credits: 4,
          description: 'Spark core architecture, RDD operations, Spark SQL, MLlib machine learning library, GraphX, and real-time streaming with Kafka.',
          topics: ['Spark Cluster Execution Model & Driver/Executor Architecture', 'RDD Transformations, Actions & Lazy Evaluation', 'Spark SQL, DataFrames & Catalyst Optimizer', 'Spark MLlib Pipelines for Distributed Machine Learning', 'Structured Streaming with Apache Kafka Integration'],
        },
        {
          code: '21MCSP401',
          name: 'Master Thesis & Major Research Project Defense',
          category: 'Core',
          credits: 10,
          description: 'Independent advanced postgraduate research thesis in AI, Cloud, Cyber Security, or Data Science with publication and oral examination.',
          topics: ['Thesis Proposal & Advisory Committee Approval', 'Implementation of Novel Computational Algorithm', 'Empirical Validation against Benchmark Datasets', 'Manuscript Preparation for Peer-Reviewed Journal', 'Public Viva Voce Examination & Defense'],
        },
      ],
    },
  },

  // ==========================================================================
  // 🎓 POSTGRADUATE (PG) - MBA (MASTER OF BUSINESS ADMINISTRATION)
  // ==========================================================================
  {
    id: 'mba',
    name: 'Master of Business Administration (MBA)',
    shortName: 'MBA',
    level: 'PG',
    stream: 'PG',
    department: 'Department of Management Studies (SIMS - Sankara Institute of Management Science)',
    durationYears: 2,
    totalSemesters: 4,
    description: 'Prestigious management programme accredited by AICTE offering dual specializations in Marketing, Finance, HR, Systems, and Operations & Logistics.',
    badgeColor: 'rose',
    semesters: {
      1: [
        {
          code: '21MBA101',
          name: 'Management Principles & Organizational Behaviour',
          category: 'Core',
          credits: 4,
          description: 'Classical and contemporary management schools, organizational culture, individual personality, perception, motivation, group dynamics, and conflict management.',
          topics: ['Evolution of Management Thought & Contemporary Theories', 'Organizational Culture, Values & Cross-Cultural Diversity', 'Personality Traits (Big Five), Perception & Attitudes', 'Motivation Theories (Maslow, Herzberg, Vroom, McClelland)', 'Group Dynamics, Team Building & Conflict Resolution'],
        },
        {
          code: '21MBA102',
          name: 'Managerial Economics for Decision Making',
          category: 'Core',
          credits: 4,
          description: 'Economic theories for corporate strategy, demand forecasting, production cost optimization, pricing strategies in oligopoly, and macroeconomic indicators.',
          topics: ['Demand Estimation & Quantitative Forecasting Techniques', 'Production Functions, Isoquants & Returns to Scale', 'Cost Theory: Short-Run vs Long-Run Cost Curves', 'Pricing Strategies: Price Discrimination, Skimming, Penetration', 'Monetary & Fiscal Policies, GDP, Inflation & Exchange Rates'],
        },
        {
          code: '21MBA103',
          name: 'Accounting for Decision Makers',
          category: 'Core',
          credits: 4,
          description: 'Financial reporting analysis, USALI/Ind-AS norms, managerial cost accounting, marginal costing for decision making, and activity-based costing (ABC).',
          topics: ['Analysis of Published Balance Sheet & Cash Flow (Ind-AS)', 'Cost Behavior & Activity-Based Costing (ABC)', 'Cost-Volume-Profit (CVP) Analysis & Shutdown Decisions', 'Differential Costing for Make-or-Buy & Export Pricing', 'Budgetary Planning & Responsibility Accounting'],
        },
      ],
      2: [
        {
          code: '21MBA201',
          name: 'Marketing Management & Consumer Insights',
          category: 'Core',
          credits: 4,
          description: 'Market segmentation, targeting, positioning (STP), product lifecycle strategies, brand equity, pricing models, omnichannel distribution, and digital marketing.',
          topics: ['Marketing Research & Consumer Decision Journey', 'STP Strategy: Segmentation, Targeting & Brand Positioning', 'Product Life Cycle (PLC) Management & New Product Development', 'Pricing Architectures, Promotion Mix & Integrated Marketing', 'Omnichannel Retailing, E-Commerce & Customer Lifetime Value'],
        },
        {
          code: '21MBA202',
          name: 'Corporate Financial Management',
          category: 'Core',
          credits: 4,
          description: 'Time value of money, capital budgeting under uncertainty, risk-return tradeoff (CAPM), dividend policy, working capital management, and valuation.',
          topics: ['Time Value of Money & Valuing Stocks/Bonds', 'Capital Investment Appraisal (NPV, IRR, Real Options)', 'Risk & Return Analysis: CAPM & Beta Calculations', 'Capital Structure Theories & Trade-Off Theory', 'Corporate Dividend Policies & Shareholder Value Creation'],
        },
        {
          code: '21MBA203',
          name: 'Human Resource Management & Talent Analytics',
          category: 'Core',
          credits: 4,
          description: 'Strategic HRM, human resource planning, recruitment, selection, training ROI, performance management (KPIs/OKRs), compensation, and labor relations.',
          topics: ['Strategic HRM & Competency Mapping', 'Modern Talent Acquisition & AI in Recruitment', 'Employee Training Needs Analysis (TNA) & Kirkpatrick Model', 'Performance Appraisal Systems: Balanced Scorecard & OKRs', 'Industrial Relations, Trade Unions & Dispute Resolution'],
        },
      ],
      3: [
        {
          code: '21MBA301',
          name: 'Strategic Management & Business Policy',
          category: 'Core',
          credits: 4,
          description: 'Industry analysis (Porter\'s 5 Forces), VRIO internal analysis, corporate strategy (diversification, M&A), international strategy, and execution frameworks.',
          topics: ['Strategic Intent: Vision, Mission & Core Values', 'External Environmental Scanning & Porter\'s Five Forces', 'VRIO Framework & Core Competencies Analysis', 'Corporate Growth Strategies: Mergers, Acquisitions & Alliances', 'Strategy Implementation: McKinsey 7S Framework & Control'],
        },
        {
          code: '21MBA302',
          name: 'Operations & Supply Chain Logistics',
          category: 'Core',
          credits: 4,
          description: 'Operations strategy, facility location and layout, lean manufacturing, Six Sigma quality, supply chain network design, inventory models, and procurement.',
          topics: ['Operations Strategy & Capacity Planning', 'Lean Operations, Just-In-Time (JIT) & Kaizen', 'Six Sigma Quality Methodology (DMAIC) & TQM', 'Supply Chain Network Optimization & Bullwhip Effect', 'Global Sourcing, Logistics & Third-Party Logistics (3PL/4PL)'],
        },
        {
          code: '21MBA303',
          name: 'Digital Business & Enterprise Systems (ERP)',
          category: 'Core',
          credits: 3,
          description: 'Digital transformation models, cloud ERP architectures, customer relationship management (CRM), business intelligence, and fintech applications.',
          topics: ['Digital Business Models & Platform Economies', 'ERP Lifecycle Implementation (SAP / Oracle Frameworks)', 'CRM Architecture & Customer Data Platforms', 'Business Intelligence Dashboards & Predictive KPIs', 'FinTech Innovations, Digital Payments & Blockchain for Business'],
        },
      ],
      4: [
        {
          code: '21MBA401',
          name: 'Entrepreneurship & Startup Management',
          category: 'Core',
          credits: 4,
          description: 'Ideation, lean startup methodology, business model canvas, venture capital & angel fundraising, IP protection, and scaling high-growth ventures.',
          topics: ['Opportunity Recognition & Design Thinking for Ideation', 'Lean Startup Methodology & Minimum Viable Product (MVP)', 'Business Model Canvas (BMC) & Financial Modeling', 'Startup Funding Rounds: Angel, Seed, Series A/B & Term Sheets', 'Patents, Trademarks, Founder Agreements & Governance'],
        },
        {
          code: '21MBAP401',
          name: 'Final Management Project & Industry Viva Voce',
          category: 'Core',
          credits: 8,
          description: 'Comprehensive 12-week industry internship project addressing a strategic corporate business challenge with board-level recommendations.',
          topics: ['Problem Statement Definition with Industry Mentors', 'Primary & Secondary Corporate Research Methodology', 'Quantitative & Qualitative Data Synthesis', 'Managerial Recommendations & Financial Impact Analysis', 'Final Defense before Academic & Industry Panel'],
        },
      ],
    },
  },
];

// Helper functions for accessing classes, streams, and subjects

export function getSankaraPrograms(): SankaraClassProgram[] {
  return SANKARA_PROGRAMS;
}

export function getProgramsByStream(stream: CollegeStream | 'ALL'): SankaraClassProgram[] {
  if (stream === 'ALL') return SANKARA_PROGRAMS;
  return SANKARA_PROGRAMS.filter((p) => p.stream === stream);
}

export function getProgramById(programId: string): SankaraClassProgram | undefined {
  return SANKARA_PROGRAMS.find((p) => p.id === programId);
}

export function getAvailableSemesters(programId: string): number[] {
  const program = getProgramById(programId);
  if (!program) return [1, 2, 3, 4, 5, 6];
  return Object.keys(program.semesters)
    .map(Number)
    .sort((a, b) => a - b);
}

export function getSubjectsForClass(programId: string, semester: number): SankaraSubject[] {
  const program = getProgramById(programId);
  if (!program || !program.semesters[semester]) {
    // Fallback: return default computer science semester subjects
    const defaultProgram = SANKARA_PROGRAMS[0];
    return defaultProgram.semesters[semester] || defaultProgram.semesters[1] || [];
  }
  return program.semesters[semester];
}

export const STORAGE_KEY_SANKARA_CLASS = 'sankara_selected_class_v1';

export function getDefaultClassSelection(): ActiveClassSelection {
  const defaultProg = SANKARA_PROGRAMS[0]; // B.Sc CS
  const sem = 6;
  const subjects = defaultProg.semesters[sem] || defaultProg.semesters[1];
  const firstSub = subjects[0] || {
    code: '21CSC601',
    name: 'Cloud Computing & Virtualization',
    category: 'Core',
    topics: ['Cloud Architecture', 'Virtualization', 'Docker & Kubernetes'],
  };

  return {
    programId: defaultProg.id,
    programName: defaultProg.name,
    shortName: defaultProg.shortName,
    level: defaultProg.level,
    stream: defaultProg.stream,
    year: Math.ceil(sem / 2),
    semester: sem,
    subjectCode: firstSub.code,
    subjectName: firstSub.name,
    category: firstSub.category,
    topics: firstSub.topics,
  };
}

export function loadSavedClassSelection(): ActiveClassSelection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SANKARA_CLASS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.programId && parsed.subjectName) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved Sankara class selection:', err);
  }
  return getDefaultClassSelection();
}

export function saveClassSelection(selection: ActiveClassSelection): void {
  try {
    localStorage.setItem(STORAGE_KEY_SANKARA_CLASS, JSON.stringify(selection));
    // Trigger custom event so other components listening on window can sync instantly
    window.dispatchEvent(
      new CustomEvent('sankara_class_changed', { detail: selection })
    );
  } catch (err) {
    console.error('Failed to save Sankara class selection:', err);
  }
}
