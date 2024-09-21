import React from "react";

function page({ params }: any) {
  return (
    <div>
      <div>Profile page</div>
      <div>{params.id}</div>
    </div>
  );
}

export default page;
