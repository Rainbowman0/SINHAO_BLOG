export const metadata = {
  title: "我是谁",
  description: "了解更多关于SINHAO的信息",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
            <img
              src="/images/avatar.jpg"
              alt="SINHAO的头像"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-dark max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              关于我
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              主业是一个立体的人，副业是算法工程师。
              我喜欢创造，热爱分享，梦想是创造有价值、有意思的产品，嘿嘿~
            </p>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              技术栈
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "JavaScript/TypeScript",
                "React/Next.js",
                "Node.js",
                "Tailwind CSS",
                "Git",
                "更多探索中...",
              ].map((skill) => (
                <div
                  key={skill}
                  className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400 text-center"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div> */}

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              联系方式
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href="https://github.com/Rainbowman0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  GitHub: @Rainbowman0
                </a>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg
                  className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:songyh_2000@163.com"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Email: songyh_2000@163.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
