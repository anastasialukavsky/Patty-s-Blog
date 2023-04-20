const { db, User, Auth, Comment, Post, Tag } = require('../db');

const users = [
  {
    firstName: 'Ange',
    lastName: 'Dyott',
  },
  {
    firstName: 'Bax',
    lastName: 'Boissier',
  },
  {
    firstName: 'Sherwynd',
    lastName: 'Chapelhow',
  },
  {
    firstName: 'Teriann',
    lastName: 'Dubery',
  },
  {
    firstName: 'Arlinda',
    lastName: 'Woollett',
    role: 'admin',
  },
  {
    firstName: 'Issi',
    lastName: 'Dummigan',
  },
  {
    firstName: 'Danette',
    lastName: 'Batrop',
  },
  {
    firstName: 'Leonora',
    lastName: 'Doleman',
  },
  {
    firstName: 'Lotti',
    lastName: 'Yashin',
  },
  {
    firstName: 'Cosette',
    lastName: 'Tolan',
  },
];
const auths = [
  {
    email: 'atrever0@oakley.com',
    password: '0M7R8NSWLuy1',
  },
  {
    email: 'rbroadbridge1@ca.gov',
    password: 'wzqKj13',
  },
  {
    email: 'vcantos2@macromedia.com',
    password: '7vsqcJpnkZC',
  },
  {
    email: 'rtaphouse3@nymag.com',
    password: 'NLcViI',
  },
  {
    email: 'ggallihaulk4@gov.uk',
    password: 'sZndg9h',
  },
  {
    email: 'ataylot5@earthlink.net',
    password: 'Dzebp8zL5',
  },
  {
    email: 'pmandel6@myspace.com',
    password: 'JEa6LdbjAL',
  },
  {
    email: 'mburde7@1688.com',
    password: '1Gx3ePHlM',
  },
  {
    email: 'lgoede8@ihg.com',
    password: 'UT2siA',
  },
  {
    email: 'mpragnall9@slate.com',
    password: 'rA1Wc8NC',
  },
];
const posts = [
  {
    title: 'Anesthesia and hypoesthesia of cornea, bilateral',
    content: 'Anesthesia and hypoesthesia of cornea, bilateral',
    date: '3/4/2023',
  },
  {
    title: 'Drown due to fall/jump fr oth crushed powered wtrcrft, init',
    content:
      'Drowning and submersion due to falling or jumping from other crushed powered watercraft, initial encounter',
    date: '10/10/2022',
  },
  {
    title: 'Unspecified hereditary corneal dystrophies',
    content: 'Unspecified hereditary corneal dystrophies',
    date: '12/28/2022',
  },
  {
    title: 'Partial placenta previa with hemorrhage, second trimester',
    content: 'Partial placenta previa with hemorrhage, second trimester',
    date: '4/18/2022',
  },
  {
    title: 'Poisoning by unsp antipsychot/neurolept, undetermined',
    content:
      'Poisoning by unspecified antipsychotics and neuroleptics, undetermined',
    date: '7/19/2022',
  },
  {
    title: 'Hypertonic, incoordinate, and prolonged uterine contractions',
    content: 'Hypertonic, incoordinate, and prolonged uterine contractions',
    date: '6/13/2022',
  },
  {
    title: 'Accidental malfunction from oth firearms, init encntr',
    content:
      'Accidental malfunction from other specified firearms, initial encounter',
    date: '8/31/2022',
  },
  {
    title: 'Coma scale, best verbal response, none, EMR',
    content:
      'Coma scale, best verbal response, none, at arrival to emergency department',
    date: '2/13/2023',
  },
  {
    title: 'Unsp fx lower end unsp tibia, subs for clos fx w routn heal',
    content:
      'Unspecified fracture of lower end of unspecified tibia, subsequent encounter for closed fracture with routine healing',
    date: '4/21/2022',
  },
  {
    title: 'Partial traum amp of unsp hip and thigh, level unsp, init',
    content:
      'Partial traumatic amputation of unspecified hip and thigh, level unspecified, initial encounter',
    date: '11/9/2022',
  },
];
const comments = [
  {
    content: 'Cont preg aft elctv fetl rdct of 1 fts or more,1st tri, fts2',
    date: '5/22/2022',
  },
  {
    content: 'Toxic effect of carb monx from utility gas, accidental',
    date: '3/27/2023',
  },
  {
    content: 'Corrosion of second degree of left ankle and foot, sequela',
    date: '3/27/2023',
  },
  {
    content: 'Disp fx of 1st metatarsal bone, r ft, 7thG',
    date: '5/13/2022',
  },
  {
    content: 'Toxic effect of fluorine gas and hydrogen fluoride, assault',
    date: '11/10/2022',
  },
  {
    content: 'Lead-induced gout, left ankle and foot',
    date: '3/27/2023',
  },
  {
    content: 'Displaced fracture of navicular [scaphoid] of left foot',
    date: '12/16/2022',
  },
  {
    content: 'Insect bite (nonvenomous), right lower leg, init encntr',
    date: '6/22/2022',
  },
  {
    content: 'Corros 2nd deg of unsp site unsp lower limb, ex ank/ft, init',
    date: '1/20/2023',
  },
  {
    content: 'Postdysenteric arthropathy, unspecified hip',
    date: '1/23/2023',
  },
];
const tags = [
  {
    name: 'Owl, great horned',
  },
  {
    name: 'Gull, silver',
  },
  {
    name: 'Mudskipper (unidentified)',
  },
  {
    name: 'Tarantula',
  },
  {
    name: 'Turtle, long-necked',
  },
  {
    name: 'Pale white-eye',
  },
  {
    name: 'Galapagos albatross',
  },
  {
    name: 'Wallaby, whip-tailed',
  },
  {
    name: 'Mongoose, small indian',
  },
  {
    name: 'Peacock, blue',
  },
];

async function seed() {
  try {
    await db.sync({
      force: true,
    });

    console.log('Syncing the database');

    /**
     * USER SEED
     */
    console.log('Seeding users...');

    const newUser = await User.bulkCreate(users, { validate: true });

    for (let user of newUser) {
      const userList = newUser.filter((usr) => user.id !== usr.id);
  
      await user.addFollower(userList);
    }

    console.log('Seeding users successful...');

    /**
     * AUTH SEED
     */
    console.log('Seeding auths?...');
    for (let user of newUser) {
      await user.createAuth(auths.pop());
    }

    console.log('Seeding auths successful...');

    /**
     * POST SEED
     */

    console.log('Seeding posts...');

    for (let user of newUser) {
      await user.createPost(posts.pop());
    }

    console.log('Seeding posts successful...');

    /**
     * COMMENT SEED
     */

    console.log('Seeding comment...');

    const newPost = await Post.findAll();
    const post = newPost.slice();

    for (let user of newUser) {
      const currentComment = comments.pop();
      currentComment.PostId = post.pop().id;
      user.createComment(currentComment);
    }

    console.log('Seeding posts successful...');

    /**
     * TAG SEED
     */
    console.log('Seeding tags...');

    const newTag = await Tag.bulkCreate(tags, { validate: true });
    for (let tag of newTag) {
      await tag.addPost(newPost.pop());
    }

    console.log('Seeding tags successful...');
    db.close();
  } catch (err) {
    console.log('Database sync failed', err);
    db.close();
  }
}

seed();

module.exports = seed;
