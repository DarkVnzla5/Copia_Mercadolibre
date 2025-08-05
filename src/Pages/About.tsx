import React from "react";
import { Link } from "react-router";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold mb-2">About Me</h2>
          <p className="mb-4">
            Hi! I am the creator of this project. I love building web
            applications with React and modern UI frameworks like DaisyUI. If
            you do like to connect, feel free to reach out!
          </p>
          <div className="flex flex-col gap-2 w-full">
            <a
              href="mailto:your.email@example.com"
              className="btn btn-primary w-full"
            >
              Email Me
            </a>
            <a
              href="https://github.com/your-github"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline w-full"
            >
              My GitHub
            </a>
            <Link to="/" className="btn btn-link w-full">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
