const DottedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full opacity-50 bg-gradient-to-br from-[#245EC5]/20 to-[#245EC5]/5">
      <svg className="w-full h-full" width="100%" height="100%">
        <defs>
          <pattern
            id="dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#245EC5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  )
}

export default DottedBackground
