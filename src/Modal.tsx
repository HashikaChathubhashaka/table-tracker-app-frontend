import React from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type ModalProps = {
  isOpen: boolean;
  onSave: () => void;
  onClose: () => void;
  menu: MenuItem[];
  selectedItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onRemoveItem: (id: number) => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onSave,onClose, menu, selectedItems, onSelectItem, onRemoveItem }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyles}>
      <div style={modalStyles}>
        <h2>Restaurant Menu</h2>
        <ul>
          {menu.map((item) => (
            <li key={item.id} onClick={() => onSelectItem(item)} style={{ cursor: "pointer" }}>
              {item.name} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>

        <h3>Selected Items</h3>
        <ul>
          {selectedItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)}
              <button onClick={() => onRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>

        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>

      </div>
    </div>
  );
};

// Modal Styles
const modalOverlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyles: React.CSSProperties = {
  backgroundColor: "black",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
};

export default Modal;
