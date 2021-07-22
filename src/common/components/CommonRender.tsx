import { CSSProperties } from "styled-components";
import { InputBox, Container, Label } from ".";
import { isAdmin, isUser } from "../../utils";

export const DefaultFC: React.FC = (): React.ReactElement => {
  return <></>;
};

export const DefaultUserRoleFC = ({
  type,
  style,
  userRoleIds,
  onClickUserRole,
}: {
  type: "CREATE" | "MODIFY";
  style?: CSSProperties;
  userRoleIds: any[];
  onClickUserRole: Function;
}): React.ReactElement => {
  return (
    <Container.RowContainer style={{ ...style }}>
      <Container.RowContainer style={{ paddingRight: 20 }}>
        <Label.CommonLabel style={{ paddingRight: 10 }}>
          사용자
        </Label.CommonLabel>
        <InputBox.RadioBox
          checked={type === "CREATE" ? true : isUser(userRoleIds)}
          onClick={() => onClickUserRole(1)}
          readOnly
        />
      </Container.RowContainer>

      <Container.RowContainer>
        <Label.CommonLabel style={{ paddingRight: 10 }}>
          관리자
        </Label.CommonLabel>
        <InputBox.RadioBox
          checked={type === "CREATE" ? false : isAdmin(userRoleIds)}
          onClick={() => onClickUserRole(2)}
          readOnly
        />
      </Container.RowContainer>
    </Container.RowContainer>
  );
};
