import { FC } from "react";

interface ParticipantsModuleProps {
  participants: string[];
}

const ParticipantsModule: FC<ParticipantsModuleProps> = ({ participants }) => {
  return (
    <>
      <h2>Participants</h2>
      <ul>
        {participants.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </>
  );
};

export default ParticipantsModule;
