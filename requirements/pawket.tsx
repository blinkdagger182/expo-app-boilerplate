// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Camera, MessageSquare, ChevronDown, Grid2X2, Upload, Smile } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { cn } from "@/lib/utils"

// export default function MobileApp() {
//   const [currentPage, setCurrentPage] = useState(1) // 0: Profile, 1: Home, 2: Messages
//   const [touchStart, setTouchStart] = useState(0)
//   const [touchEnd, setTouchEnd] = useState(0)
//   const [isMounted, setIsMounted] = useState(false)
//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       user: "Jessica",
//       avatar: "/placeholder.svg?height=40&width=40",
//       image: "/placeholder.svg?height=300&width=300&text=🌊",
//       caption: "I swear this wasn't planned! ✨",
//       time: "36m",
//     },
//     {
//       id: 2,
//       user: "Kyle",
//       avatar: "/placeholder.svg?height=40&width=40",
//       image: "/placeholder.svg?height=300&width=300&text=🌲",
//       caption: "Perfect day for a hike 🌲",
//       time: "1h",
//     },
//     {
//       id: 3,
//       user: "Ava",
//       avatar: "/placeholder.svg?height=40&width=40",
//       image: "/placeholder.svg?height=300&width=300&text=☕",
//       caption: "Coffee break ☕",
//       time: "2h",
//     },
//     {
//       id: 4,
//       user: "Irfan",
//       avatar: "/placeholder.svg?height=40&width=40",
//       image: "/placeholder.svg?height=300&width=300&text=🍔",
//       caption: "Homemade dinner",
//       time: "4h",
//     },
//     {
//       id: 5,
//       user: "Britney",
//       avatar: "/placeholder.svg?height=40&width=40",
//       image: "/placeholder.svg?height=300&width=300&text=🍕",
//       caption: "Best pizza in town!",
//       time: "5h",
//     },
//   ])

//   const containerRef = useRef<HTMLDivElement>(null)

//   // Use useEffect to handle client-side only code
//   useEffect(() => {
//     setIsMounted(true)

//     // Add mouse swipe simulation for desktop testing
//     const handleMouseDown = (e: MouseEvent) => {
//       setTouchStart(e.clientX)
//     }

//     const handleMouseMove = (e: MouseEvent) => {
//       if (touchStart) {
//         setTouchEnd(e.clientX)
//       }
//     }

//     const handleMouseUp = () => {
//       if (touchStart && touchEnd) {
//         if (touchStart - touchEnd > 100) {
//           // Swipe left
//           if (currentPage < 2) setCurrentPage(currentPage + 1)
//         }

//         if (touchStart - touchEnd < -100) {
//           // Swipe right
//           if (currentPage > 0) setCurrentPage(currentPage - 1)
//         }
//         setTouchStart(0)
//         setTouchEnd(0)
//       }
//     }

//     const container = containerRef.current
//     if (container) {
//       container.addEventListener("mousedown", handleMouseDown)
//       container.addEventListener("mousemove", handleMouseMove)
//       container.addEventListener("mouseup", handleMouseUp)
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("mousedown", handleMouseDown)
//         container.removeEventListener("mousemove", handleMouseMove)
//         container.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [touchStart, touchEnd, currentPage])

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStart(e.targetTouches[0].clientX)
//   }

//   const handleTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX)
//   }

//   const handleTouchEnd = () => {
//     if (touchStart - touchEnd > 100) {
//       // Swipe left
//       if (currentPage < 2) setCurrentPage(currentPage + 1)
//     }

//     if (touchStart - touchEnd < -100) {
//       // Swipe right
//       if (currentPage > 0) setCurrentPage(currentPage - 1)
//     }
//   }

//   // If not mounted yet, show a simple loading state
//   if (!isMounted) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
//         <div className="w-full max-w-sm h-[600px] bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center">
//           <div className="text-white">Loading...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
//       <div
//         ref={containerRef}
//         className="relative w-full max-w-sm h-[600px] overflow-hidden bg-gray-900 rounded-3xl shadow-xl"
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* Page Indicator */}
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-1">
//           <div className={cn("w-2 h-2 rounded-full", currentPage === 0 ? "bg-white" : "bg-gray-500")}></div>
//           <div className={cn("w-2 h-2 rounded-full", currentPage === 1 ? "bg-white" : "bg-gray-500")}></div>
//           <div className={cn("w-2 h-2 rounded-full", currentPage === 2 ? "bg-white" : "bg-gray-500")}></div>
//         </div>

//         {/* Swipe Navigation Instructions - only show initially */}
//         <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-gray-900/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
//           Swipe left/right to navigate pages
//         </div>

//         {/* Pages Container */}
//         <div
//           className="flex h-full transition-transform duration-300 ease-in-out"
//           style={{ transform: `translateX(-${currentPage * 100}%)` }}
//         >
//           {/* Profile Page */}
//           <div className="min-w-full h-full flex flex-col">
//             <ProfilePage />
//           </div>

//           {/* Home Page */}
//           <div className="min-w-full h-full flex flex-col">
//             <HomePage posts={posts} />
//           </div>

//           {/* Messages Page */}
//           <div className="min-w-full h-full flex flex-col">
//             <MessagesPage />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function HomePage({ posts }: { posts: any[] }) {
//   const [currentPostIndex, setCurrentPostIndex] = useState(0)
//   const [touchStartY, setTouchStartY] = useState(0)
//   const [touchEndY, setTouchEndY] = useState(0)
//   const [showLibrary, setShowLibrary] = useState(false)

//   const handleTouchStartY = (e: React.TouchEvent) => {
//     setTouchStartY(e.targetTouches[0].clientY)
//   }

//   const handleTouchMoveY = (e: React.TouchEvent) => {
//     setTouchEndY(e.targetTouches[0].clientY)
//   }

//   const handleTouchEndY = () => {
//     if (!showLibrary) {
//       if (touchStartY - touchEndY > 70) {
//         // Swipe up
//         if (currentPostIndex < posts.length) setCurrentPostIndex(currentPostIndex + 1)
//       }

//       if (touchStartY - touchEndY < -70) {
//         // Swipe down
//         if (currentPostIndex > 0) setCurrentPostIndex(currentPostIndex - 1)
//       }
//     }
//   }

//   // Add mouse wheel event for desktop
//   const handleWheel = (e: React.WheelEvent) => {
//     if (!showLibrary) {
//       if (e.deltaY > 0) {
//         // Scroll down
//         if (currentPostIndex < posts.length) setCurrentPostIndex(currentPostIndex + 1)
//       } else {
//         // Scroll up
//         if (currentPostIndex > 0) setCurrentPostIndex(currentPostIndex - 1)
//       }
//     }
//   }

//   const toggleLibrary = () => {
//     setShowLibrary(!showLibrary)
//   }

//   const viewPost = (index: number) => {
//     setCurrentPostIndex(index + 1) // +1 because index 0 is camera
//     setShowLibrary(false)
//   }

//   return (
//     <div
//       className="flex flex-col h-full bg-gray-900 overflow-hidden"
//       onTouchStart={handleTouchStartY}
//       onTouchMove={handleTouchMoveY}
//       onTouchEnd={handleTouchEndY}
//       onWheel={handleWheel}
//     >
//       {/* Header */}
//       <div className="p-4 flex items-center justify-between">
//         <Avatar className="w-10 h-10 border border-gray-700">
//           <AvatarImage src="/placeholder.svg?height=40&width=40" />
//           <AvatarFallback>ME</AvatarFallback>
//         </Avatar>

//         <Button variant="ghost" className="bg-gray-800/80 rounded-full px-4 h-10 text-white">
//           Everyone
//           <ChevronDown className="w-4 h-4 ml-1" />
//         </Button>

//         <Button
//           variant="ghost"
//           size="icon"
//           className="w-10 h-10 rounded-full bg-gray-800/80 text-white"
//           onClick={toggleLibrary}
//         >
//           <MessageSquare className="w-5 h-5" />
//         </Button>
//       </div>

//       {showLibrary ? (
//         <div className="flex-1 p-4 overflow-y-auto">
//           <h2 className="text-white text-lg font-medium mb-4">Photo Library</h2>
//           <div className="grid grid-cols-3 gap-2">
//             {posts.map((post, index) => (
//               <div
//                 key={post.id}
//                 className="aspect-square rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
//                 onClick={() => viewPost(index)}
//               >
//                 <img
//                   src={post.image || "/placeholder.svg"}
//                   alt={`Post by ${post.user}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col px-4 relative">
//           {/* Vertical Swipe Indicator - small dots on right side */}
//           <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-center space-y-1">
//             {Array.from({ length: posts.length + 1 }).map((_, i) => (
//               <div
//                 key={i}
//                 className={cn("w-1 h-1 rounded-full", currentPostIndex === i ? "bg-white" : "bg-gray-600")}
//               ></div>
//             ))}
//           </div>

//           {/* Camera View (First Page) */}
//           {currentPostIndex === 0 && (
//             <div className="w-full h-full flex flex-col items-center justify-center">
//               <div className="w-full aspect-square rounded-3xl overflow-hidden bg-gray-800 mb-4 relative">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Camera className="w-16 h-16 text-gray-600" />
//                 </div>
//               </div>
//               <div className="mt-auto mb-16 text-gray-400 text-sm flex flex-col items-center">
//                 <p className="mb-2">Take a photo to share</p>
//                 <Button size="sm" variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">
//                   <Camera className="w-4 h-4 mr-2" />
//                   <span>Capture</span>
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Posts (Subsequent Pages) */}
//           {currentPostIndex > 0 && currentPostIndex <= posts.length && (
//             <div className="w-full h-full flex flex-col">
//               {/* Main Image */}
//               <div className="flex-1 flex flex-col">
//                 <div className="w-full aspect-square rounded-3xl overflow-hidden bg-gray-800 mt-2">
//                   <img
//                     src={posts[currentPostIndex - 1].image || "/placeholder.svg"}
//                     alt={`Post by ${posts[currentPostIndex - 1].user}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* User info below image */}
//                 <div className="flex items-center mt-2 mb-auto">
//                   <Avatar className="w-6 h-6 mr-2">
//                     <AvatarImage src={posts[currentPostIndex - 1].avatar} />
//                     <AvatarFallback>{posts[currentPostIndex - 1].user.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <span className="text-white text-sm font-medium">{posts[currentPostIndex - 1].user}</span>
//                   <span className="text-gray-400 text-xs ml-2">{posts[currentPostIndex - 1].time}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Message input */}
//       {currentPostIndex > 0 && currentPostIndex <= posts.length && !showLibrary && (
//         <div className="mb-20 mt-2 px-4">
//           <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
//             <Input
//               placeholder="Send message..."
//               className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-500"
//             />
//             <div className="flex space-x-2 ml-2">
//               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-yellow-500 p-0">
//                 <span className="text-xl">❤️</span>
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-yellow-500 p-0">
//                 <span className="text-xl">😍</span>
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-yellow-500 p-0">
//                 <span className="text-xl">🔥</span>
//               </Button>
//               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 p-0">
//                 <Smile className="h-5 w-5" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bottom Navigation */}
//       <div className="absolute bottom-0 left-0 right-0 bg-black py-4 flex justify-around items-center z-20">
//         <Button variant="ghost" size="icon" className="text-white">
//           <Grid2X2 className="w-6 h-6" />
//         </Button>
//         <div className="w-14 h-14 rounded-full border-2 border-yellow-500 flex items-center justify-center">
//           <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
//         </div>
//         <Button variant="ghost" size="icon" className="text-white">
//           <Upload className="w-6 h-6" />
//         </Button>
//       </div>
//     </div>
//   )
// }

// function ProfilePage() {
//   const stats = [
//     { label: "Posts", value: "24" },
//     { label: "Friends", value: "142" },
//     { label: "Likes", value: "987" },
//   ]

//   return (
//     <div className="flex flex-col h-full bg-gray-900 overflow-y-auto pb-16">
//       <div className="p-4">
//         <h1 className="text-xl font-bold text-white">Profile</h1>
//       </div>

//       <div className="flex flex-col items-center px-4 pt-4 pb-6">
//         <Avatar className="w-24 h-24 mb-4 border-2 border-gray-600">
//           <AvatarImage src="/placeholder.svg?height=96&width=96" />
//           <AvatarFallback>ME</AvatarFallback>
//         </Avatar>
//         <h2 className="text-xl font-bold text-white">Robby</h2>
//         <p className="text-gray-400 text-sm mt-1">@robby_designs</p>

//         <div className="flex justify-between w-full mt-6">
//           {stats.map((stat, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <span className="text-white font-bold">{stat.value}</span>
//               <span className="text-gray-400 text-xs">{stat.label}</span>
//             </div>
//           ))}
//         </div>

//         <Button className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white">Edit Profile</Button>
//       </div>

//       <div className="px-4">
//         <h3 className="text-white font-medium mb-3">Your Photos</h3>
//         <div className="grid grid-cols-3 gap-2">
//           {Array.from({ length: 9 }).map((_, i) => (
//             <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-700">
//               <img
//                 src={`/placeholder.svg?height=120&width=120&text=${i + 1}`}
//                 alt={`Photo ${i + 1}`}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function MessagesPage() {
//   const conversations = [
//     {
//       id: 1,
//       name: "Jessica",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "See you tomorrow!",
//       time: "2m",
//       unread: true,
//     },
//     {
//       id: 2,
//       name: "Kyle",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "Thanks for the photos!",
//       time: "1h",
//       unread: false,
//     },
//     {
//       id: 3,
//       name: "Ava",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "Let's meet up this weekend",
//       time: "3h",
//       unread: false,
//     },
//     {
//       id: 4,
//       name: "Britney",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "Did you see that?",
//       time: "5h",
//       unread: false,
//     },
//     {
//       id: 5,
//       name: "Sabrina",
//       avatar: "/placeholder.svg?height=40&width=40",
//       lastMessage: "I'll send you the details",
//       time: "1d",
//       unread: false,
//     },
//   ]

//   return (
//     <div className="flex flex-col h-full bg-gray-900">
//       <div className="p-4 border-b border-gray-700">
//         <h1 className="text-xl font-bold text-white">Messages</h1>
//       </div>

//       <div className="p-4">
//         <div className="relative">
//           <Input placeholder="Search messages..." className="bg-gray-700 border-gray-600 text-white pl-10" />
//           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="11" cy="11" r="8" />
//               <path d="m21 21-4.3-4.3" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto pb-16">
//         {conversations.map((convo) => (
//           <div
//             key={convo.id}
//             className={cn(
//               "flex items-center p-4 hover:bg-gray-700/50 cursor-pointer",
//               convo.unread ? "bg-gray-700/30" : "",
//             )}
//           >
//             <Avatar className="w-12 h-12 mr-3">
//               <AvatarImage src={convo.avatar} />
//               <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-white font-medium truncate">{convo.name}</h3>
//                 <span className="text-gray-400 text-xs">{convo.time}</span>
//               </div>
//               <p className={cn("text-sm truncate", convo.unread ? "text-white font-medium" : "text-gray-400")}>
//                 {convo.lastMessage}
//               </p>
//             </div>
//             {convo.unread && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>}
//           </div>
//         ))}
//       </div>

//       <div className="absolute bottom-16 right-4">
//         <Button size="icon" className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-3" />
//             <path d="M18 3v4" />
//             <path d="M22 3h-4" />
//             <path d="m15 9-6 6" />
//             <path d="M9 15h6" />
//           </svg>
//         </Button>
//       </div>
//     </div>
//   )
// }

