import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { PRNewsItem } from '../data/prNewsData';

interface PRNewsCardProps {
  article: PRNewsItem;
  index: number;
}

const PRNewsCard: React.FC<PRNewsCardProps> = ({ article, index }) => {
  const handleReadMore = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const truncateText = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700"
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {article.image && article.image.trim() !== '' ? (
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200/e5e7eb/6b7280?text=No+Image';
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta Information */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {article.source.startsWith('http') || article.source.startsWith('/') ? (
              <div className="flex items-center justify-center w-20 h-8 bg-white dark:bg-gray-100 rounded-md border border-gray-200 dark:border-gray-300 p-1">
                <img
                  src={article.source}
                  alt="Publication logo"
                  className="max-w-full max-h-full object-contain"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    const container = target.parentElement as HTMLElement;
                    container.innerHTML =
                      '<span class="text-xs font-semibold text-gray-600">Publication</span>';
                  }}
                />
              </div>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#2d4cc8]/10 text-[#1a1947] dark:bg-[#2d4cc8]/20 dark:text-[#2d4cc8]">
                {article.source}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {article.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#2d4cc8] dark:group-hover:text-[#2d4cc8] transition-colors duration-300">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-1 text-sm">
          {truncateText(article.excerpt)}
        </p>

        {/* Read More Button */}
        <motion.button
          onClick={handleReadMore}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1a1947] to-[#2d4cc8] hover:from-[#1a1947]/90 hover:to-[#2d4cc8]/90 text-white font-semibold rounded-lg transition-all duration-300 self-start group/button shadow-lg hover:shadow-xl"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Read full article: ${article.title}`}
        >
          Read Full Article
          <motion.div className="transition-transform duration-300" whileHover={{ x: 2, y: -2 }}>
            <ExternalLink size={16} />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PRNewsCard;
