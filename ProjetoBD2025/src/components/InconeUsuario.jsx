import React from 'react';
import PropTypes from 'prop-types';

const IconeUsuario = ({ name, bgColor = '#0d6efdff', color = '#fff' }) => {
  const getFirstLetter = () => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '?'; // Retorna '?' se o nome for inválido ou vazio
    }
    return name.trim().charAt(0).toUpperCase();
  };

  const avatarStyle = {
    backgroundColor: bgColor,
    color: color,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  return (
    <div style={avatarStyle}>
      {getFirstLetter()}
    </div>
  );
};

IconeUsuario.propTypes = {
  name: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  color: PropTypes.string,
};

export default IconeUsuario;