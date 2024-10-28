import { MouseEventHandler } from "react";

export interface skillCard{
    name:string,
    icon:string,
    level:string,
    handleClick:MouseEventHandler<HTMLButtonElement>
}