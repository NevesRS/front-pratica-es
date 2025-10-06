import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
};

export default function Modal({ isOpen, onClose, children, className = "" }: ModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto ${className}`}>
                {children}
            </div>
        </div>
    );
}
