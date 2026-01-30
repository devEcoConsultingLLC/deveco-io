import { db } from '../client';
import { users, projects, hardwareItems, tags, projectTags, communities, contests } from '../schema';

async function seed() {
  console.log('Seeding database...');

  // Users
  const [alice, bob, carol] = await db
    .insert(users)
    .values([
      {
        email: 'alice@example.com',
        username: 'alice',
        displayName: 'Alice Chen',
        bio: 'Edge AI researcher and maker. Building smart things with tiny chips.',
        role: 'admin',
      },
      {
        email: 'bob@example.com',
        username: 'bob',
        displayName: 'Bob Martinez',
        bio: 'Embedded systems engineer. ESP32 enthusiast.',
        role: 'user',
      },
      {
        email: 'carol@example.com',
        username: 'carol',
        displayName: 'Carol Williams',
        bio: 'ML engineer focused on TinyML and on-device inference.',
        role: 'user',
      },
    ])
    .returning();

  // Tags
  const tagValues = [
    { name: 'ESP32', slug: 'esp32', category: 'platform' as const },
    { name: 'Raspberry Pi', slug: 'raspberry-pi', category: 'platform' as const },
    { name: 'Arduino', slug: 'arduino', category: 'platform' as const },
    { name: 'TensorFlow Lite', slug: 'tensorflow-lite', category: 'framework' as const },
    { name: 'Python', slug: 'python', category: 'language' as const },
    { name: 'C++', slug: 'cpp', category: 'language' as const },
    { name: 'Computer Vision', slug: 'computer-vision', category: 'topic' as const },
    { name: 'Voice Recognition', slug: 'voice-recognition', category: 'topic' as const },
    { name: 'Sensor Fusion', slug: 'sensor-fusion', category: 'topic' as const },
    { name: 'TinyML', slug: 'tinyml', category: 'topic' as const },
  ];
  const insertedTags = await db.insert(tags).values(tagValues).returning();

  // Projects
  const projectValues = [
    {
      slug: 'esp32-object-detection',
      title: 'Real-time Object Detection on ESP32-S3',
      summary:
        'Deploy a custom trained TensorFlow Lite model for real-time object detection on the ESP32-S3 with camera module.',
      authorId: alice!.id,
      status: 'published' as const,
      difficulty: 'advanced' as const,
      featured: true,
      viewCount: 1247,
      likeCount: 89,
      commentCount: 23,
      publishedAt: new Date('2024-01-15'),
    },
    {
      slug: 'voice-controlled-robot-arm',
      title: 'Voice-Controlled Robot Arm with Edge AI',
      summary:
        'Build a robot arm that responds to voice commands using on-device speech recognition. No cloud required.',
      authorId: bob!.id,
      status: 'published' as const,
      difficulty: 'intermediate' as const,
      featured: true,
      viewCount: 856,
      likeCount: 67,
      commentCount: 15,
      publishedAt: new Date('2024-02-01'),
    },
    {
      slug: 'smart-garden-monitor',
      title: 'Smart Garden Monitor with Anomaly Detection',
      summary:
        'An intelligent garden monitoring system that detects plant diseases and water stress using TinyML on Arduino Nano 33 BLE.',
      authorId: carol!.id,
      status: 'published' as const,
      difficulty: 'beginner' as const,
      featured: false,
      viewCount: 432,
      likeCount: 34,
      commentCount: 8,
      publishedAt: new Date('2024-02-10'),
    },
    {
      slug: 'gesture-recognition-glove',
      title: 'Gesture Recognition Glove for Sign Language',
      summary:
        'A wearable glove that translates sign language gestures to text using IMU sensors and a tiny neural network.',
      authorId: alice!.id,
      status: 'published' as const,
      difficulty: 'advanced' as const,
      featured: true,
      viewCount: 2103,
      likeCount: 156,
      commentCount: 41,
      publishedAt: new Date('2024-01-20'),
    },
    {
      slug: 'wildlife-camera-trap',
      title: 'AI-Powered Wildlife Camera Trap',
      summary:
        'A battery-powered camera trap that classifies animals on-device using a Raspberry Pi Zero 2 W and custom MobileNet model.',
      authorId: bob!.id,
      status: 'published' as const,
      difficulty: 'intermediate' as const,
      featured: false,
      viewCount: 678,
      likeCount: 52,
      commentCount: 12,
      publishedAt: new Date('2024-02-15'),
    },
  ];
  const insertedProjects = await db.insert(projects).values(projectValues).returning();

  // Project-Tag associations
  const esp32Tag = insertedTags.find((t) => t.slug === 'esp32')!;
  const tfliteTag = insertedTags.find((t) => t.slug === 'tensorflow-lite')!;
  const cvTag = insertedTags.find((t) => t.slug === 'computer-vision')!;
  const voiceTag = insertedTags.find((t) => t.slug === 'voice-recognition')!;
  const tinymlTag = insertedTags.find((t) => t.slug === 'tinyml')!;
  const rpiTag = insertedTags.find((t) => t.slug === 'raspberry-pi')!;
  const arduinoTag = insertedTags.find((t) => t.slug === 'arduino')!;

  await db.insert(projectTags).values([
    { projectId: insertedProjects[0]!.id, tagId: esp32Tag.id },
    { projectId: insertedProjects[0]!.id, tagId: tfliteTag.id },
    { projectId: insertedProjects[0]!.id, tagId: cvTag.id },
    { projectId: insertedProjects[1]!.id, tagId: esp32Tag.id },
    { projectId: insertedProjects[1]!.id, tagId: voiceTag.id },
    { projectId: insertedProjects[2]!.id, tagId: arduinoTag.id },
    { projectId: insertedProjects[2]!.id, tagId: tinymlTag.id },
    { projectId: insertedProjects[3]!.id, tagId: tinymlTag.id },
    { projectId: insertedProjects[4]!.id, tagId: rpiTag.id },
    { projectId: insertedProjects[4]!.id, tagId: cvTag.id },
  ]);

  // Hardware items
  await db.insert(hardwareItems).values([
    {
      slug: 'esp32-s3-devkitc',
      name: 'ESP32-S3-DevKitC-1',
      vendor: 'Espressif',
      category: 'microcontroller',
      description: 'ESP32-S3 development board with Wi-Fi and Bluetooth 5, AI acceleration.',
      priceUsd: '9.99',
      projectCount: 3,
    },
    {
      slug: 'raspberry-pi-zero-2w',
      name: 'Raspberry Pi Zero 2 W',
      vendor: 'Raspberry Pi Foundation',
      category: 'single-board-computer',
      description: 'Compact single-board computer with quad-core ARM Cortex-A53.',
      priceUsd: '15.00',
      projectCount: 2,
    },
    {
      slug: 'arduino-nano-33-ble',
      name: 'Arduino Nano 33 BLE Sense',
      vendor: 'Arduino',
      category: 'microcontroller',
      description: 'Arduino board with BLE, IMU, microphone, and environmental sensors.',
      priceUsd: '31.10',
      projectCount: 2,
    },
    {
      slug: 'coral-usb-accelerator',
      name: 'Coral USB Accelerator',
      vendor: 'Google',
      category: 'accelerator',
      description: 'USB accessory with Edge TPU coprocessor for fast ML inference.',
      priceUsd: '59.99',
      projectCount: 1,
    },
    {
      slug: 'ov2640-camera-module',
      name: 'OV2640 Camera Module',
      vendor: 'Various',
      category: 'sensor',
      description: '2MP camera module compatible with ESP32-S3 for vision projects.',
      priceUsd: '4.50',
      projectCount: 2,
    },
  ]);

  // Communities
  await db.insert(communities).values([
    {
      slug: 'tinyml-makers',
      name: 'TinyML Makers',
      description: 'A community for makers building machine learning projects on microcontrollers.',
      memberCount: 342,
      projectCount: 28,
      isOfficial: true,
    },
    {
      slug: 'esp32-projects',
      name: 'ESP32 Projects',
      description: 'Share and discover projects built with the ESP32 family of chips.',
      memberCount: 567,
      projectCount: 45,
      isOfficial: false,
    },
    {
      slug: 'edge-vision',
      name: 'Edge Vision',
      description: 'Computer vision at the edge — cameras, models, and real-time inference.',
      memberCount: 189,
      projectCount: 15,
      isOfficial: true,
    },
  ]);

  // Contests
  await db.insert(contests).values([
    {
      slug: 'tinyml-challenge-2024',
      title: 'TinyML Challenge 2024',
      description: 'Build the most creative TinyML project using any microcontroller under $20.',
      prizeDescription: '$2,000 grand prize + hardware kits',
      prizeValueUsd: '5000.00',
      sponsorName: 'Edge AI Foundation',
      status: 'active',
      startsAt: new Date('2024-01-01'),
      endsAt: new Date('2024-03-31'),
    },
    {
      slug: 'green-ai-hackathon',
      title: 'Green AI Hackathon',
      description: 'Design energy-efficient AI solutions for environmental monitoring.',
      prizeDescription: '$1,500 first place + Coral dev kits',
      prizeValueUsd: '3000.00',
      sponsorName: 'Google Coral',
      status: 'upcoming',
      startsAt: new Date('2024-04-01'),
      endsAt: new Date('2024-05-31'),
    },
  ]);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
