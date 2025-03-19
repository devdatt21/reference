// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../api/auth/options';
// import PostList from '@/components/PostList';
// import CreatePostButton from '@/components/CreatePostButton';

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect('/api/auth/signin');
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Your Credit Dashboard</h1>
//         <CreatePostButton />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* Recent Credit Experiences Section */}
//         <div className="lg:col-span-3">
//           <h2 className="text-2xl font-semibold mb-4">Recent Credit Experiences</h2>
//           <PostList />
//         </div>

//         {/* Credit Tips Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Credit Tips</h2>
//           <ul className="space-y-4">
//             {[
//               { title: 'Always read the fine print', desc: 'Hidden fees often lurk in the terms and conditions.' },
//               { title: 'Check your credit report regularly', desc: 'Errors can negatively impact your score.' },
//               { title: 'Keep utilization under 30%', desc: 'Using too much of your available credit can hurt your score.' },
//               { title: 'Pay more than the minimum', desc: 'Minimum payments keep you in debt longer.' },
//             ].map(({ title, desc }, index) => (
//               <li key={index} className="pb-3 border-b border-gray-200 last:border-none">
//                 <h3 className="font-medium">{title}</h3>
//                 <p className="text-sm text-gray-600">{desc}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
