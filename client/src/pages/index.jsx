import styled from "@emotion/styled";
import { Menu, Add } from "@mui/icons-material";
import { Box, IconButton, Button, Divider } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { Context } from "../App";
import InputBox from "../components/inputBox";
import DataSourceList from "../components/dataSourceList";
import ContextList from "../components/ContextList";
import GettingStarted from "../components/gettingStarted";
import CreateContextModal from "../components/createContextModal";
import SQLQueryBox from "../components/sqlQueryBox";
import useStateLS from "../hooks/useStateLS";
import HistoryComponent from "../components/historyComponent";

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
`;

const SideBar = styled(Box)`
  width: 5%;
  &.is-open {
    width: 20%;
  }
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.5s ease-in-out;
`;

const MainPage = observer(() => {
  const store = useContext(Context);
  const [contexts, setContexts] = useStateLS("contexts", []);
  const [shouldUpdateContexts, setShouldUpdateContexts] = useState(false);
  const fetchContext = () => {
    if (store.state.currentContext === "") {
      store.setCurrentContext("none");
      return;
    }
    if (store.state.currentContext === "none") {
      return;
    }
    if (store.state.currentContext === "temp") {
      return;
    }

    if (!contexts) {
      return {};
    }

    const currCtx =
      contexts.find(
        (context) => context.talkName === store.state.currentContext
      ) || {};

    return currCtx;
  };
  useEffect(() => {
    setCurrentContext(fetchContext());
  }, [store.state.currentContext]);

  const [currentContext, setCurrentContext] = useState(fetchContext());

  const [text, setText] = useState("");

  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState({});
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const wsRequest = (serverUrl, requestSocket, requestData, responseSocket) => {
    const socket = io(serverUrl);

    socket.on("connect", () => {
      socket.emit(requestSocket, requestData);
    });

    return new Promise((resolve) => {
      socket.on(responseSocket, (data) => {
        resolve(data);
        socket.disconnect();
      });
    });
  };
  const sendSpeechAnyBase = async (text) => {
    try {
      store.setIsLoading(true);
      const res = await fetch("http://192.168.203.105:8000/getDDL", {
        method: "POST",
        timeout: 180000,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textQuery: text,
          dbUrl: currentContext.source,
        }),
      });
      const data = await res.json();
      const ddl = data.ddl;
      const { sqlQuery } = await wsRequest(
        "http://192.168.203.105:5000",
        "process",
        { ddl, nlPrompt: text },
        "response"
      );
      setSqlQuery(sqlQuery);
    } catch (error) {
      console.log(error);
    } finally {
      store.setIsLoading(false);
    }
  };
  const sendSpeechTestBase = async (text) => {
    try {
      store.setIsLoading(true);
      const res = await fetch("http://192.168.203.105:8000/getDDL", {
        method: "POST",
        timeout: 180000,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textQuery: text,
          useTestDatabase: true,
        }),
      });
      const data = await res.json();
      const ddl = data.ddl;

      const { sqlQuery } = await wsRequest(
        "http://192.168.203.105:5000",
        "process",
        { ddl, nlPrompt: text },
        "response"
      );
      setSqlQuery(sqlQuery);
    } catch (error) {
      console.log(error);
    } finally {
      store.setIsLoading(false);
    }
  };

  const sendQueryTestDatabase = async (sqlQuery) => {
    try {
      store.setIsLoading(true);
      const res = await fetch("http://192.168.203.105:8000/execute", {
        method: "POST",
        timeout: 180000,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sqlQuery: sqlQuery,
          useTestDatabase: true,
        }),
      });
      const data = await res.json();
      setQueryResult(data.queryResult);
    } catch (error) {
      console.log(error);
    } finally {
      store.setIsLoading(false);
    }
  };

  const sendQueryTestAnyDatabase = async (sqlQuery) => {
    try {
      store.setIsLoading(true);
      const res = await fetch("http://192.168.203.105:8000/execute", {
        method: "POST",
        timeout: 180000,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dbUrl: currentContext.source,
          sqlQuery: sqlQuery,
        }),
      });
      const data = await res.json();
      setQueryResult(data.queryResult);
    } catch (error) {
      console.log(error);
    } finally {
      store.setIsLoading(false);
    }
  };
  useEffect(() => {
    if (queryResult && queryResult.headers && queryResult.headers.length > 0) {
      const newContexts = contexts.map((context) => {
        if (context.talkName === store.state.currentContext) {
          return {
            ...context,
            history: [
              ...context.history,
              { text, sqlQuery, queryResult: queryResult },
            ],
          };
        }
        return context;
      });
      setContexts(newContexts);
      setText("");
      setSqlQuery("");
      setQueryResult({});
      setShouldUpdateContexts(true);
    }
  }, [queryResult]);
  useEffect(() => {
    setText("");
    setSqlQuery("");
    setQueryResult({});
  }, [store.state.currentContext]);

  useEffect(() => {
    if (shouldUpdateContexts) {
      setShouldUpdateContexts(false);
      setCurrentContext(fetchContext());
    }
  }, [shouldUpdateContexts]);

  return (
    <Container>
      <SideBar className={isHistoryOpen ? "is-open" : ""}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "10%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              padding: "0 5px",
            }}
          >
            <Button
              color="secondary"
              variant="outlined"
              sx={{
                display: "flex",
                margin: "0.5rem",
                flex: 1,
              }}
              onClick={() => {
                store.setCurrentContext("temp");
                setIsChooseModalOpen(true);
              }}
            >
              <Add />
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "90%",
              flexDirection: "column",
              justifyContent: "flex-start",
              display: isHistoryOpen ? "flex" : "none",
            }}
          >
            <ContextList contexts={contexts} />
          </Box>
        </Box>
      </SideBar>
      <Box
        sx={{
          width: "95%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {store.state.currentContext === "none" ? <GettingStarted /> : null}
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {store.state.currentContext !== "none" ? (
            <Box sx={{ width: "100%", height: "78vh" }}>
              <HistoryComponent context={currentContext} />
              <Divider
                sx={{
                  width: "100%",
                  height: "1px",
                  color: "black",
                }}
              />
            </Box>
          ) : null}
          {store.state.currentContext !== "none" && currentContext ? (
            <Box
              width="80%"
              height="20vh"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  width="80%"
                  height="40%"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <InputBox
                      text={text}
                      setText={setText}
                      onSend={
                        currentContext.mode === "source"
                          ? sendSpeechAnyBase
                          : sendSpeechTestBase
                      }
                    />
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ width: "100%" }}>
                      <SQLQueryBox
                        query={sqlQuery}
                        setQuery={setSqlQuery}
                        isEditable={Boolean(queryResult)}
                        onSend={
                          currentContext.mode === "source"
                            ? sendQueryTestAnyDatabase
                            : sendQueryTestDatabase
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      {store.state.currentContext === "temp" && isChooseModalOpen && (
        <CreateContextModal
          contexts={contexts}
          setContexts={setContexts}
          open={isChooseModalOpen}
          onClose={() => {
            setIsChooseModalOpen(false);
          }}
        />
      )}
    </Container>
  );
});

export default MainPage;
