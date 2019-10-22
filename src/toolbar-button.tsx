import { ButtonProps } from "@material-ui/core/Button"
import React, { FC } from "react"
import { Button } from "@material-ui/core"

type TToolbarButtonProps = {} & ButtonProps
export const ToolbarButton: FC<TToolbarButtonProps> = props => {
  return (
    <Button size="small" style={{ minWidth: 0, width: 30, height: 30, padding: 0 }} {...props} />
  )
}
