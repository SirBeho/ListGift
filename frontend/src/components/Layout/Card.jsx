import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { EyeIcon } from '@heroicons/react/20/solid';

function Card({ data, litt = false }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const perspective = 500;
  const throttleDelay = 20; // Milisegundos - ajusta este valor

  const handleMouseMove = (event) => {

    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;

    const width = card.offsetWidth;
    const height = card.offsetHeight;

    const mouseX = relativeX - width / 2;
    const mouseY = relativeY - height / 2;

    const rotateXAmount = (mouseY / height) * 20;
    const rotateYAmount = (mouseX / width) * -20;

    setRotateX(rotateXAmount);
    setRotateY(rotateYAmount);

    card.style.transform = `perspective(${perspective}px) rotateX(${rotateXAmount}deg) rotateY(${rotateYAmount}deg) scale(1.02)`;
  };

  const throttledMouseMove = useRef(throttle(handleMouseMove, throttleDelay));

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (card) {
      card.style.transition = 'transform 0.05s ease-out'; // Transición más rápida al entrar
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) {
      setRotateX(0);
      setRotateY(0);
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.transition = 'transform 0.2s ease-in-out'; // Transición más rápida al salir
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', throttledMouseMove.current);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', throttledMouseMove.current);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Función de throttling
  function throttle(func, delay) {
    let timeoutId;
    let lastArgs;
    let lastThis;

    return function wrapper(...args) {
      lastArgs = args;
      lastThis = this;

      if (!timeoutId) {
        func.apply(this, args);
        timeoutId = setTimeout(() => {
          timeoutId = null;
        }, delay);
      }
    };
  }

  return (

    <div
      key={data.id}
      ref={cardRef}
      className={`bg-white   rounded-xl shadow-lg overflow-hidden transition duration-200 ease-in-out transform `} // Transición más rápida por defecto
      style={{ transformOrigin: 'center' }}
    >
     

      <div className="relative "
      >
        <img
          src={data.image? data.image : 'pictures/git.png'}
          className="w-full h-48 object-cover rounded-t-xl "
          alt={`data ${data.name}`}
        />

        <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full px-2 py-1 opacity-75 hover:opacity-100 transition-opacity duration-200">
          {data.items ? data.items.length : 0} items
        </div>
      </div>



      <div className="p-4 pt-0"       >
        <div className='absolute left-0 w-full h-full opacity-[15%]' style={{

          backgroundImage: `linear-gradient(100deg, ${data.color1} 0%, ${data.color2} 100%)` ,
        }}  ></div>
        {litt ? (
          <h4 className="text-sm font-semibold text-center text-gray-800 mb-1">{data.user?.name}</h4>
        ) : (
          ''
        )}



        <h4 className="text-lg font-semibold text-center text-gray-800 mb-3">{data.name}</h4>
        <div className="flex justify-center space-x-3  ">
          <Link
            to={`/lists/${data.id}`}
            className={`bg-blue-500 hover:bg-blue-600 text-white ${litt ? 'py-0 px-2 h-7' : 'py-2 px-4 font-bold'}  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center transform transition-transform duration-200 hover:scale-105`}
          >
           <EyeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Ver
          </Link>
          
        </div>
      </div>

    </div>
  );
}

export default Card;