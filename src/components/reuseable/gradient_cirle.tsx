const CircleComponent = ({path,isRounded = true,children}: {path?: string, isRounded?: boolean, children?: React.ReactNode}) => {
  return (
    <div className={`mb-8 h-12 w-12 ${isRounded ? 'rounded-full' : ''} bg-gradient-to-r from-black via-gray-500 to-white flex items-center justify-center overflow-hidden border-2 border-white p-1`}>
      {path && <img
        src={path}
        alt="Profile"
        className="h-full w-full object-cover rounded-full"
      />}

      {
        children && children
      }
    </div>
  )
}

export default CircleComponent