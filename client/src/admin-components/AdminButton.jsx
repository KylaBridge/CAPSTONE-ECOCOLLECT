import React from 'react';
import './styles/AdminButton.css';
import { FaEye, FaPlus, FaUpload, FaEdit, FaTimes, FaSave, FaEyeSlash } from 'react-icons/fa';
import {AiOutlineDelete } from 'react-icons/ai';

const AdminButton = ({ type, size = 'medium', children, onClick, className, isActive, ...props }) => {
  const getButtonClass = () => {
    switch (type) {
      case 'view':
        return 'admin-btn-view';
      case 'upload':
        return 'admin-btn-upload';
      case 'update':
        return 'admin-btn-update';
      case 'remove':
        return 'admin-btn-remove';
      case 'add':
        return 'admin-btn-add';
      case 'cancel':
        return 'admin-btn-cancel';
      case 'save':
        return 'admin-btn-save';
      case 'primary':
        return 'admin-btn-primary';
      default:
        return 'admin-btn-default';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'view':
        return isActive ? <FaEyeSlash className="button-icon" /> : <FaEye className="button-icon" />;
      case 'upload':
        return <FaUpload className="button-icon" />;
      case 'update':
        return <FaEdit className="button-icon" />;
      case 'remove':
        return <AiOutlineDelete className="button-icon" />;
      case 'add':
        return <FaPlus className="button-icon" />;
      case 'cancel':
        return <FaTimes className="button-icon" />;
      case 'save':
        return <FaSave className="button-icon" />;
      default:
        return null;
    }
  };

  return (
    <button
      className={`admin-button admin-btn-${size} ${getButtonClass()} ${isActive ? 'active' : ''} ${className || ''}`}
      onClick={onClick}
      {...props}
    >
      {getIcon()}
      <span className="button-text">{children}</span>
    </button>
  );
};

export default AdminButton; 