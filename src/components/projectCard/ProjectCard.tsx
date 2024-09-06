import React from "react";
import "./ProjectCard.scss";

function ProjectCard({
  img,
  pp,
  cat,
  username,
}: {
  img: string;
  pp: string;
  cat: string;
  username: string;
}) {
  return (
    <div className="projectCard">
      <img src={img} alt="" />
      <div className="info">
        <img src={pp} alt="" />
        <div className="texts">
          <h2>{cat}</h2>
          <span>{username}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
