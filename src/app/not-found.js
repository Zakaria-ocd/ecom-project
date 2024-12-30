'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div 
        className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="relative">
            <motion.div 
              className="relative z-10"
              variants={itemVariants}
            >
              <motion.h1 
                className="my-2 text-gray-800 font-bold text-2xl"
                variants={itemVariants}
              >
                Looks like you've found the
                doorway to the great nothing
              </motion.h1>
              <motion.p 
                className="my-2 text-gray-800"
                variants={itemVariants}
              >
                Sorry about that! Please visit our homepage to get where you need to go.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/"
                  className="inline-block sm:w-full lg:w-auto my-2 border rounded-md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 transition duration-300"
                >
                  Take me there!
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative mt-8"
              variants={itemVariants}
            >
              <motion.h1 
                variants={numberVariants}
                className="text-9xl font-bold text-gray-800 absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-10"
              >
                404
              </motion.h1>
              <motion.h1 
                variants={numberVariants}
                className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
              >
                404
              </motion.h1>
            </motion.div>
          </div>
        </div>
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <Image
            src={"/assets/not-found.png"}
            alt="404 group illustration"
            width={500}
            height={500}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}