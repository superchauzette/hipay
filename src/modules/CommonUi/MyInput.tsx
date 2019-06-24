import styled from "styled-components";

export const MyInput = styled.input`
  border: none;
  border-bottom: 1px solid #80808063;
  outline: none;
  background-color: transparent;
  font-size: 18px;
  font-weight: bold;
  :disabled {
    border-bottom: 0px;
  }
`;
