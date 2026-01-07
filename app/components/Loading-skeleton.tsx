import React from 'react'

  const LoadingSkeleton = () => (
  
      <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-slate-100">
          <td className="px-4 py-4">
            <div className="skeleton h-5 w-32"></div>
          </td>
          <td className="px-4 py-4">
            <div className="skeleton h-5 w-24 ml-auto"></div>
          </td>
          <td className="px-4 py-4">
            <div className="flex gap-2 justify-center">
              <div className="skeleton h-8 w-8 rounded-lg"></div>
              <div className="skeleton h-8 w-8 rounded-lg"></div>
            </div>
          </td>
        </tr>
      ))}
      </>
  );

  export default LoadingSkeleton