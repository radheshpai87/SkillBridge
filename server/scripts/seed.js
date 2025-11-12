import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserModel, Gig as GigModel, Application as ApplicationModel } from '../models/index.js';
import { connectDatabase } from '../config/database.js';
import logger from '../utils/logger.js';

const sampleStudents = [
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['JavaScript', 'React', 'Web Development'],
    bio: 'Computer science student at IIT Delhi passionate about building web applications. Available for frontend development and coding tutorials.'
  },
  {
    name: 'Priya Venkatesan',
    email: 'priya.venkatesan@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Graphic Design', 'Adobe Photoshop', 'Canva'],
    bio: 'Design student from NID Ahmedabad with 2 years of experience in creating social media content and marketing materials for Indian brands.'
  },
  {
    name: 'Rohan Kumar',
    email: 'rohan.kumar@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Content Writing', 'Social Media', 'Copywriting'],
    bio: 'English literature student specializing in content creation and social media management. Experience with Indian consumer brands.'
  },
  {
    name: 'Ananya Singh',
    email: 'ananya.singh@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Photography', 'Video Editing', 'Adobe Premiere'],
    bio: 'Film student from FTII Pune with professional photography equipment. Love capturing Indian culture and creating compelling video content.'
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.patel@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Python', 'Data Analysis', 'Excel'],
    bio: 'Data science student experienced in analyzing business data and creating reports for Indian startups. Strong Excel and Python skills.'
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya.reddy@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Tutoring', 'Mathematics', 'JEE Prep'],
    bio: 'Mathematics major with experience tutoring high school students in math and JEE preparation. Familiar with Indian education system.'
  }
];

const sampleBusinesses = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@spicecafe.com',
    password: 'password123',
    role: 'business',
    companyName: 'Spice Route Café',
    description: 'Authentic Indian cuisine café in Bangalore serving traditional dishes and modern fusion food.'
  },
  {
    name: 'Meera Iyer',
    email: 'meera@fitnesstemple.com',
    password: 'password123',
    role: 'business',
    companyName: 'Fitness Temple',
    description: 'Modern fitness studio in Mumbai offering yoga, pilates, and traditional Indian wellness practices.'
  },
  {
    name: 'Amit Agarwal',
    email: 'amit@ethnicsarees.com',
    password: 'password123',
    role: 'business',
    companyName: 'Ethnic Sarees & Crafts',
    description: 'Traditional handloom saree boutique specializing in authentic Indian textiles and cultural garments.'
  },
  {
    name: 'Sunita Sharma',
    email: 'sunita@legalconsultants.com',
    password: 'password123',
    role: 'business',
    companyName: 'Sharma Legal Consultants',
    description: 'Legal firm in Delhi specializing in corporate law, intellectual property, and startup compliance.'
  },
  {
    name: 'Vijay Singh',
    email: 'vijay@sweetdelights.com',
    password: 'password123',
    role: 'business',
    companyName: 'Sweet Delights Bakery',
    description: 'Family-owned bakery in Chennai creating traditional Indian sweets, cakes, and fusion desserts.'
  }
];

const sampleGigs = [
  {
    title: 'Social Media Content Creator for Indian Cuisine',
    description: 'Looking for a creative student to help manage our Instagram and Facebook pages. Need 3-5 posts per week showcasing our authentic Indian dishes, traditional recipes, and café culture. Experience with Indian food photography preferred.',
    budget: 2500,
    location: 'Bangalore',
    requiredSkills: ['Social Media', 'Content Writing', 'Photography']
  },
  {
    title: 'E-commerce Website Development',
    description: 'Need a student developer to help build an e-commerce website for our saree boutique using React and JavaScript. Should include product catalog, payment integration with Indian banks, and shipping calculator. Experience with Indian e-commerce platforms like Shopify India preferred.',
    budget: 8000,
    location: 'Mumbai',
    requiredSkills: ['JavaScript', 'Web Development', 'React']
  },
  {
    title: 'Yoga Class Photography & Video',
    description: 'Seeking photographer/videographer to capture high-quality images and videos during our traditional yoga and wellness classes for marketing materials and social media. Understanding of Indian wellness culture appreciated.',
    budget: 3500,
    location: 'Mumbai',
    requiredSkills: ['Photography', 'Video Editing']
  },
  {
    title: 'Festival Marketing Materials Design',
    description: 'Need creative designs for promotional posters and social media graphics for upcoming Indian festivals. Should incorporate traditional motifs and modern design elements for Diwali and Holi campaigns.',
    budget: 2000,
    location: 'Delhi',
    requiredSkills: ['Graphic Design', 'Adobe Photoshop', 'Canva']
  },
  {
    title: 'Handloom Product Photography',
    description: 'Looking for someone to photograph our traditional sarees and handloom products for our online store. Need clean, professional product shots that showcase the intricate craftsmanship and traditional designs.',
    budget: 4000,
    location: 'Chennai',
    requiredSkills: ['Photography', 'Graphic Design']
  },
  {
    title: 'Instagram Reels for Cultural Content',
    description: 'Help us create engaging Instagram Reels showcasing traditional Indian fashion, cultural stories, and fashion tips. Need 2-3 reels per week featuring our boutique collection and Indian heritage.',
    budget: 3000,
    location: 'Delhi',
    requiredSkills: ['Video Editing', 'Social Media', 'Content Writing']
  },
  {
    title: 'Legal Document Data Management',
    description: 'Need help organizing client case files and entering data into our legal case management system. Experience with Indian legal documentation, Excel, and data analysis preferred. Knowledge of Indian corporate law is a plus.',
    budget: 2500,
    location: 'Delhi',
    requiredSkills: ['Data Analysis', 'Excel']
  },
  {
    title: 'Legal Website Content & Blog Writing',
    description: 'Looking for a writer with legal knowledge to create engaging content for our law firm website, write blog posts about Indian corporate law updates, and update our content management system. Understanding of Indian legal system preferred.',
    budget: 3500,
    location: 'Bangalore',
    requiredSkills: ['Content Writing', 'Copywriting']
  },
  {
    title: 'Traditional Sweets Social Media Manager',
    description: 'Manage our social media presence by posting daily specials, traditional sweet recipes, festival offerings, and engaging with customers online. Experience with Indian food industry preferred.',
    budget: 3200,
    location: 'Chennai',
    requiredSkills: ['Social Media', 'Photography', 'Content Writing']
  },
  {
    title: 'Recipe Cards for Indian Sweets',
    description: 'Design beautiful recipe cards for our signature traditional Indian sweets and desserts to give away to customers. Should incorporate Indian cultural elements and match our traditional brand aesthetic.',
    budget: 2500,
    location: 'Chennai',
    requiredSkills: ['Graphic Design', 'Canva']
  }
];

async function seedDatabase() {
  try {
    logger.info('🌱 Starting database seed...');
    
    await connectDatabase();

    logger.warn('🗑️  Clearing existing data...');
    await UserModel.deleteMany({});
    await GigModel.deleteMany({});
    await ApplicationModel.deleteMany({});
    logger.success('✅ Existing data cleared');

    logger.info('👥 Creating student users...');
    const students = [];
    for (const studentData of sampleStudents) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const student = await UserModel.create({
        ...studentData,
        password: hashedPassword
      });
      students.push(student);
      logger.debug(`   ✓ Created student: ${student.name}`);
    }
    logger.success(`Created ${students.length} students`);

    logger.info('🏢 Creating business users...');
    const businesses = [];
    for (const businessData of sampleBusinesses) {
      const hashedPassword = await bcrypt.hash(businessData.password, 10);
      const business = await UserModel.create({
        ...businessData,
        password: hashedPassword
      });
      businesses.push(business);
      logger.debug(`   ✓ Created business: ${business.companyName}`);
    }
    logger.success(`Created ${businesses.length} businesses`);

    logger.info('💼 Creating gigs...');
    const createdGigs = [];
    for (let i = 0; i < sampleGigs.length; i++) {
      const gigData = sampleGigs[i];
      const business = businesses[i % businesses.length];
      
      const gig = await GigModel.create({
        ...gigData,
        postedBy: business._id,
        applicants: []
      });
      createdGigs.push(gig);
      logger.debug(`   ✓ Created gig: ${gig.title}`);
    }
    logger.success(`Created ${createdGigs.length} gigs`);

    logger.info('🎯 Creating sample applications...');
    let applicationCount = 0;
    
    // Shuffle function to randomize students
    const shuffle = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    
    for (let businessIndex = 0; businessIndex < businesses.length; businessIndex++) {
      const businessGigs = createdGigs.filter((_, idx) => idx % businesses.length === businessIndex);
      
      for (const gig of businessGigs) {
        // Randomly select 1-3 applicants for each gig
        const numApplicants = Math.floor(Math.random() * 3) + 1; // 1-3 applicants
        const shuffledStudents = shuffle(students);
        const selectedStudents = shuffledStudents.slice(0, Math.min(numApplicants, students.length));
        
        const statuses = ['pending', 'pending', 'accepted', 'rejected']; // More pending than others
        
        for (const student of selectedStudents) {
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          await ApplicationModel.create({
            gigId: gig._id,
            studentId: student._id,
            status: randomStatus
          });
          applicationCount++;
        }
        
        gig.applicants = selectedStudents.map(s => s._id);
        await gig.save();
        
        logger.debug(`   ✓ Added ${selectedStudents.length} applicant(s) to: ${gig.title}`);
      }
    }
    logger.success(`Created ${applicationCount} applications`);

    logger.success('\n🎉 Database seeded successfully!');
    logger.info('\n📊 Summary:');
    logger.info(`   Students: ${students.length}`);
    logger.info(`   Businesses: ${businesses.length}`);
    logger.info(`   Gigs: ${createdGigs.length}`);
    logger.info(`   Applications: ${applicationCount}`);
    logger.info('\n🔐 Test Credentials:');
    logger.info('   Student: arjun.sharma@student.edu / password123');
    logger.info('   Business: rajesh@spicecafe.com / password123');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
