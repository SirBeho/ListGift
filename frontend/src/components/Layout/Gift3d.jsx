
import Spline from '@splinetool/react-spline';
import React, { Suspense, lazy } from 'react';


export default function Objeto3D() {
  return (
    // 2. Usar Suspense para manejar el estado de carga
    <Suspense fallback={<div>Cargando Objeto 3D...</div>}>
      <div  className='h-56 w-[200%]  relative right-0 -inset-x-1/2  z-0'>
        <Spline scene="https://prod.spline.design/ePHCRs3CLX3qM3Uh/scene.splinecode"  className='z-10'/>
      </div>
    </Suspense>
  );
}


/*import Spline from "@splinetool/react-spline";
import React, { Suspense, lazy } from 'react';


const LazySpline = lazy(() => 
  import("@splinetool/react-spline").catch(() => {
      // Fallback en caso de que la importación de Spline falle
      return { default: () => <div className="text-red-500 font-bold">Error: No se pudo cargar el visor 3D.</div> };
  })
);

 const Gift3d = ({ className = "" }) => {

  // 🚨 NOTA: Reemplaza la URL de la escena con la tuya
  const SPLINE_SCENE_URL = "https://prod.spline.design/Cp36IG3pCfxsm4Z2/scene.splinecode";
  
  return (
      // Usamos Suspense para manejar el estado de carga del objeto 3D
      <Suspense fallback={<div className="text-gray-500 text-sm">Cargando 3D...</div>}>
          <div className={`w-full h-full ${className}`}>
              <LazySpline scene={SPLINE_SCENE_URL} />
          </div>
      </Suspense>
  );
};

export default Gift3d;*/