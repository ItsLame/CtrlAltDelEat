"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";

export default function Item() {
  const router = useRouter();

  return (
    <div>
      <h1>this is da items!</h1>
      {/*<p>its name is: {props.name}</p>*/}
      {/*<p>its desc is: {props.desc}</p>*/}
      <Button onClick={router.back}>click to go back!</Button>
    </div>
  );
}
