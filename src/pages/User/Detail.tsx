import _ from "lodash";
import { ChangeEvent, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { IUserInfo } from "../../api/interface";
import { updateUser } from "../../api/PatchAPI";
import { signUp } from "../../api/PostAPI";
import {
  Button,
  CommonRender,
  Container,
  InputBox,
  Label
} from "../../common/components";
import { IComponent } from "../../common/interface";
import { PageType, UnknownObject } from "../../common/type";
import { I18nCommandEnum } from "../../core";
import { RoutePath } from "../../route/routes";
import { validationObject } from "../../utils";

/**
 * @description User Detail Component
 * @param {IComponent} props
 * @param {IUserDetailProps} location
 * @returns {React.ReactElement}
 */
interface IUserDetailProps extends IUserInfo {
  type: PageType;
}

const UserDetail: React.FC<IComponent> = (
  props: IComponent
): React.ReactElement => {
  const { t } = useTranslation();
  const location = useLocation();
  const state = location.state as IUserDetailProps;

  const [userEmail, setEmail] = useState("");
  const [userNickname, setNickname] = useState(state.userNickname ?? "");
  const [userPw, setPassword] = useState("");
  const [userRoleIds, setUserRole] = useState<number[]>(
    state.type === "MODIFY"
      ? state.userRoles.map((roles) => roles.role.roleId)
      : [1]
  );

  const _showMessageModal = (message: string): void => {
    if (_.isFunction(window.globalFunc.showModalAction)) {
      window.globalFunc.showModalAction({
        type: "MESSAGE",
        item: {
          childrenProps: { message },
        },
      });
    }
  };

  const validationItem = useCallback((item: UnknownObject): boolean => {
    if (!validationObject(item)) {
      _showMessageModal("회원가입 정보를 다시 한번 확인 해주시기 바랍니다.");
      return false;
    }

    return true;
  }, []);

  const navigate = useNavigate();
  const _signUp = useCallback(async (): Promise<void | boolean> => {
    const item = { userEmail, userNickname, userPw, userRoleIds };

    if (validationItem(item)) {
      try {
        await signUp(item);
        navigate(RoutePath.USER_LIST);
      } catch (error: any) {
        switch (error.status) {
          case 409: {
            _showMessageModal(
              "중복된 이메일이 있습니다. 다른 이메일을 사용해주시기 바랍니다."
            );
            return false;
          }
        }
      }
    }
  }, [userEmail, userNickname, userPw, userRoleIds]);

  const _updateUser = useCallback(async (): Promise<void> => {
    const item = { userId: state.userId, userNickname, userPw, userRoleIds };
    try {
      await updateUser(item);
      navigate(RoutePath.USER_LIST);
    } catch (error: unknown) {
      console.log("_updateUser Error", error);
    }
  }, [state.userId, userNickname, userPw, userRoleIds]);

  const onClickRoleBox = useCallback(
    (roleId: number): void => {
      if (userRoleIds.indexOf(roleId) !== -1) {
        const _userRole = userRoleIds.filter((_roleId: number) => {
          return roleId !== _roleId;
        });
        setUserRole(_userRole);
      } else {
        setUserRole([...userRoleIds, roleId]);
      }
    },
    [userRoleIds]
  );

  const createTypeRender = useCallback((): React.ReactElement => {
    return (
      <Container.ColumnContainer>
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.EMAIL)}</Label.CommonLabel>
        </Container.RowContainer>
        <InputBox.CommonInputBox
          style={{
            padding: 5,
            marginBottom: 15,
          }}
          placeholder={t(I18nCommandEnum.EMAIL)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.NICKNAME)}</Label.CommonLabel>
        </Container.RowContainer>
        <InputBox.CommonInputBox
          style={{
            padding: 5,
            marginBottom: 15,
          }}
          placeholder={t(I18nCommandEnum.NICKNAME)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
        />
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.PASSWORD)}</Label.CommonLabel>
        </Container.RowContainer>
        <InputBox.CommonInputBox
          style={{
            padding: 5,
            marginBottom: 15,
          }}
          type={"password"}
          placeholder={t(I18nCommandEnum.PASSWORD)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.ROLE)}</Label.CommonLabel>
        </Container.RowContainer>
        <CommonRender.DefaultUserRoleFC
          type={state.type}
          style={{ marginBottom: 15 }}
          userRoleIds={userRoleIds}
          onClickUserRole={(roleId: number) => onClickRoleBox(roleId)}
        />
        {/**********************************************************/}
        <Button.SubMitButton
          style={{
            margin: 10,
          }}
          onClick={_signUp}
        >
          {t(I18nCommandEnum.CREATE)}
        </Button.SubMitButton>
      </Container.ColumnContainer>
    );
  }, [
    state.type,
    userRoleIds,
  ]);

  const modifyTypeRender = useCallback((): React.ReactElement => {
    return (
      <Container.ColumnContainer>
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.NICKNAME)}</Label.CommonLabel>
        </Container.RowContainer>
        <InputBox.CommonInputBox
          style={{
            padding: 5,
            marginBottom: 15,
          }}
          placeholder={t(I18nCommandEnum.NICKNAME)}
          value={userNickname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
        />
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.PASSWORD)}</Label.CommonLabel>
        </Container.RowContainer>
        <InputBox.CommonInputBox
          style={{
            padding: 5,
            marginBottom: 15,
          }}
          type={"password"}
          placeholder={t(I18nCommandEnum.PASSWORD)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {/**********************************************************/}
        <Container.RowContainer
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Label.CommonLabel>{t(I18nCommandEnum.ROLE)}</Label.CommonLabel>
        </Container.RowContainer>
        <CommonRender.DefaultUserRoleFC
          type={state.type}
          style={{ marginBottom: 15 }}
          userRoleIds={userRoleIds}
          onClickUserRole={(roleId: number) => onClickRoleBox(roleId)}
        />
        {/**********************************************************/}
        <Button.SubMitButton
          style={{
            margin: 10,
          }}
          onClick={_updateUser}
        >
          {t(I18nCommandEnum.MODIFY)}
        </Button.SubMitButton>
      </Container.ColumnContainer>
    );
  }, [
    state.type,
    userNickname,
    userRoleIds,
  ]);

  return (
    <Container.RowContainer
      style={{ justifyContent: "flex-start", width: "100%", margin: 20 }}
    >
      {state.type === "CREATE" ? createTypeRender() : modifyTypeRender()}
    </Container.RowContainer>
  );
};

export default UserDetail;
