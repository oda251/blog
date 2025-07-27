import React from 'react';
import { gsap } from 'gsap';
import TweetEditor from './TweetEditor';

const CreateTweetButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
    if (!isModalOpen && modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  }, [isModalOpen]);

  return (
    <div>
      {/* Modal for TweetEditor */}
      {(isModalOpen || modalRef.current) && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
          style={{ pointerEvents: isModalOpen ? 'auto' : 'none' }}
          onClick={() => setIsModalOpen(false)}
        >
          <TweetEditor />
        </div>
      )}
      {/* Floating "+" Button */}
      <button
        id="create-tweet-button"
        type="button"
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-indigo-700 text-white flex items-center justify-center shadow-lg text-3xl hover:bg-indigo-600 hover:scale-[115%] active:scale-[95%] transition z-50"
        aria-label="New Tweet"
        onClick={() => setIsModalOpen(isModalOpen ? false : true)}
      >
        <i className="fa-solid fa-plus text-base text-center"></i>
      </button>
    </div>
  );
};

export default CreateTweetButton;
