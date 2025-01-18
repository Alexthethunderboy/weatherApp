import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Props {
  iconName: string;
  className?: string;
}

export default function WeatherIcon({ iconName, className }: Props) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconName}@4x.png`;

  const variants = {
    initial: { scale: 0.8, opacity: 0, rotate: -20 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 10 },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Image src={iconUrl || "/placeholder.svg"} alt="Weather Icon" width={100} height={100} />
    </motion.div>
  );
}

