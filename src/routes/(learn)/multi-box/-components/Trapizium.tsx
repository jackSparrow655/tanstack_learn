import './style.css'
export default function Trapezium() {
  return (
    <>
      <div className="w-36 h-10 bg-green-500 clip-trapezium flex items-center justify-center text-white">
        Trapezium
      </div>
      <div
        className="
    w-64 h-40 bg-purple-500 text-white flex items-center justify-center
    [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)]
  "
      >
        Trapezium
      </div>
    </>
  )
}
