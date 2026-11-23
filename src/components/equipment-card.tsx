import Link from "next/link";
type Item = {
  _id: string;
  name: string;
  category: string;
  price: number;
  rentalType: string;
  location: string;
  image: string;
  availability?: boolean;
};
export function EquipmentCard({ item }: { item: Item }) {
  return (
    <article className="equipment-card">
      <div className="equipment-image">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900"
          }
          alt={item.name}
        />
        <span className="pill">{item.category}</span>
      </div>
      <div className="card-content">
        <div className="card-title-row">
          <h3>{item.name}</h3>
          <strong>
            ${item.price}
            <small>/{item.rentalType?.toLowerCase()}</small>
          </strong>
        </div>
        <p className="muted">{item.location}</p>
        <div className="card-bottom">
          <span
            className={
              item.availability === false ? "status unavailable" : "status"
            }
          >
            {item.availability === false ? "Unavailable" : "Available"}
          </span>
          <Link href={`/equipment/${item._id}`} className="button button-small">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
