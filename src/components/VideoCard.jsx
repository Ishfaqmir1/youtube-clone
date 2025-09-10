export default function VideoCard({ title, channel, views, thumbnail }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-2 cursor-pointer">
      <img
        src={thumbnail}
        alt={title}
        className="rounded-lg w-full h-48 object-cover"
      />
      <div className="mt-2">
        <h2 className="text-sm font-semibold line-clamp-2">{title}</h2>
        <p className="text-xs text-gray-600">{channel}</p>
        <p className="text-xs text-gray-500">{views} views</p>
      </div>
    </div>
  );
}
