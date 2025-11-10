import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel, GigModel, ApplicationModel } from './models.js';
import { connectDatabase } from './db.js';

const sampleStudents = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['JavaScript', 'React', 'Web Development'],
    bio: 'Computer science student passionate about building web applications. Available for frontend development and tutoring.'
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Graphic Design', 'Adobe Photoshop', 'Canva'],
    bio: 'Design enthusiast with 2 years of experience in creating social media content and marketing materials.'
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Content Writing', 'Social Media', 'Copywriting'],
    bio: 'Marketing major specializing in content creation and social media management. Strong writing skills.'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Photography', 'Video Editing', 'Adobe Premiere'],
    bio: 'Film student with professional photography equipment. Love capturing moments and creating compelling video content.'
  },
  {
    name: 'Ryan Patel',
    email: 'ryan.patel@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Python', 'Data Analysis', 'Excel'],
    bio: 'Data science student experienced in analyzing business data and creating reports. Strong Excel and Python skills.'
  },
  {
    name: 'Sophie Taylor',
    email: 'sophie.taylor@student.edu',
    password: 'password123',
    role: 'student',
    skills: ['Tutoring', 'Mathematics', 'SAT Prep'],
    bio: 'Education major with experience tutoring high school students in math and test preparation.'
  }
];

const sampleBusinesses = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@localcafe.com',
    password: 'password123',
    role: 'business',
    companyName: 'Downtown Coffee House',
    description: 'Cozy coffee shop in the heart of downtown, serving artisan coffee and pastries.'
  },
  {
    name: 'Mike Anderson',
    email: 'mike@fitnessstudio.com',
    password: 'password123',
    role: 'business',
    companyName: 'Anderson Fitness Studio',
    description: 'Local fitness studio offering personal training and group classes.'
  },
  {
    name: 'Lisa Chen',
    email: 'lisa@boutique.com',
    password: 'password123',
    role: 'business',
    companyName: 'Trendy Boutique',
    description: 'Fashion boutique specializing in sustainable and locally-made clothing.'
  },
  {
    name: 'David Martinez',
    email: 'david@lawoffice.com',
    password: 'password123',
    role: 'business',
    companyName: 'Martinez Law Office',
    description: 'Small law firm specializing in family law and estate planning.'
  },
  {
    name: 'Jennifer Lee',
    email: 'jennifer@bakery.com',
    password: 'password123',
    role: 'business',
    companyName: 'Sweet Treats Bakery',
    description: 'Family-owned bakery creating custom cakes and pastries for all occasions.'
  }
];

const sampleGigs = [
  {
    title: 'Social Media Content Creator',
    description: 'Looking for a creative student to help manage our Instagram and Facebook pages. Need 3-5 posts per week showcasing our daily specials and coffee culture.',
    budget: 150,
    location: 'Downtown',
    requiredSkills: ['Social Media', 'Content Writing', 'Photography']
  },
  {
    title: 'Website Development Help',
    description: 'Need a student developer to help build a simple website for our coffee shop. Should include menu, location, and online ordering integration.',
    budget: 500,
    location: 'Downtown',
    requiredSkills: ['JavaScript', 'Web Development', 'React']
  },
  {
    title: 'Fitness Class Photography',
    description: 'Seeking photographer to capture high-quality images during our group fitness classes for marketing materials and social media.',
    budget: 200,
    location: 'Midtown',
    requiredSkills: ['Photography', 'Video Editing']
  },
  {
    title: 'Marketing Flyer Design',
    description: 'Need creative designs for promotional flyers for our new class schedule. Should be eye-catching and professional.',
    budget: 100,
    location: 'Midtown',
    requiredSkills: ['Graphic Design', 'Adobe Photoshop', 'Canva']
  },
  {
    title: 'Product Photography for Online Store',
    description: 'Looking for someone to photograph our clothing items for our online store. Need clean, professional product shots.',
    budget: 250,
    location: 'East Side',
    requiredSkills: ['Photography', 'Graphic Design']
  },
  {
    title: 'Instagram Reels Creator',
    description: 'Help us create engaging Instagram Reels showcasing our boutique and fashion tips. Need 2-3 reels per week.',
    budget: 175,
    location: 'East Side',
    requiredSkills: ['Video Editing', 'Social Media', 'Content Writing']
  },
  {
    title: 'Administrative Data Entry',
    description: 'Need help organizing client files and entering data into our case management system. Detail-oriented student preferred.',
    budget: 120,
    location: 'West End',
    requiredSkills: ['Data Analysis', 'Excel']
  },
  {
    title: 'Website Content Writing',
    description: 'Looking for a writer to create engaging content for our law office website, including practice area descriptions and blog posts.',
    budget: 200,
    location: 'West End',
    requiredSkills: ['Content Writing', 'Copywriting']
  },
  {
    title: 'Bakery Social Media Manager',
    description: 'Manage our social media presence by posting daily specials, custom cake photos, and engaging with customers online.',
    budget: 180,
    location: 'South Side',
    requiredSkills: ['Social Media', 'Photography', 'Content Writing']
  },
  {
    title: 'Recipe Card Design',
    description: 'Design beautiful recipe cards for our signature items to give away to customers. Should match our brand aesthetic.',
    budget: 150,
    location: 'South Side',
    requiredSkills: ['Graphic Design', 'Canva']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDatabase();

    console.log('🗑️  Clearing existing data...');
    await UserModel.deleteMany({});
    await GigModel.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('👥 Creating student users...');
    const students = [];
    for (const studentData of sampleStudents) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const student = await UserModel.create({
        ...studentData,
        password: hashedPassword
      });
      students.push(student);
      console.log(`   ✓ Created student: ${student.name}`);
    }

    console.log('🏢 Creating business users...');
    const businesses = [];
    for (const businessData of sampleBusinesses) {
      const hashedPassword = await bcrypt.hash(businessData.password, 10);
      const business = await UserModel.create({
        ...businessData,
        password: hashedPassword
      });
      businesses.push(business);
      console.log(`   ✓ Created business: ${business.companyName}`);
    }

    console.log('💼 Creating gigs...');
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
      console.log(`   ✓ Created gig: ${gig.title}`);
    }

    console.log('🎯 Creating sample applications...');
    
    for (let businessIndex = 0; businessIndex < businesses.length; businessIndex++) {
      const businessGigs = createdGigs.filter((_, idx) => idx % businesses.length === businessIndex);
      
      for (const gig of businessGigs) {
        const numApplicants = Math.min(2, students.length);
        const selectedStudents = students.slice(0, numApplicants);
        
        for (const student of selectedStudents) {
          await ApplicationModel.create({
            gigId: gig._id,
            studentId: student._id,
            status: 'pending'
          });
        }
        
        gig.applicants = selectedStudents.map(s => s._id);
        await gig.save();
        
        console.log(`   ✓ Added ${selectedStudents.length} applicant(s) to: ${gig.title}`);
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Students: ${students.length}`);
    console.log(`   Businesses: ${businesses.length}`);
    console.log(`   Gigs: ${sampleGigs.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('   Student: alex.chen@student.edu / password123');
    console.log('   Business: sarah@localcafe.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
