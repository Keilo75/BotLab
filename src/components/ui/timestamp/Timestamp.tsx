import { Text, Tooltip } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface TimestampProps {
  timestamp: number;
}

interface TimestampObject {
  time: string;
  full: string;
}

const Timestamp: React.FC<TimestampProps> = ({ timestamp }) => {
  const [object, setObject] = useState<TimestampObject>({ time: "", full: "" });

  useEffect(() => {
    const date = new Date(timestamp);

    setObject({ time: date.toLocaleTimeString(), full: date.toLocaleString() });
  }, [timestamp]);

  return (
    <Tooltip label={object.full}>
      <Text color="dimmed">[{object.time}]</Text>
    </Tooltip>
  );
};

export default Timestamp;
