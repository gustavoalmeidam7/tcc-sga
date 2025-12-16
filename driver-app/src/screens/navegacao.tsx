import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Alert,
  PanResponder,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useMemo, useRef } from "react";
import travelService from "@/services/travel";
import { formatarEndereco } from "@/lib/format-utils";
import ConfirmModal from "@/components/ConfirmModal";
import { Travel } from "@/types/models";
import { RootStackParamList } from "@/types/navigation";
import { usePreferences } from "@/contexts/PreferencesContext";

import { buildLeafletHtml } from "@/lib/map-html";
import { useRideNavigation } from "@/hooks/useRideNavigation";

const DEFAULT_CENTER = { latitude: -23.5489, longitude: -46.6388 };

export default function NavegacaoScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id: tripId } = (route.params as any) || {};
  const insets = useSafeAreaInsets();
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const { preferences } = usePreferences();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const isExpandedRef = useRef(false);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const headerOpacityAnim = useRef(new Animated.Value(1)).current;
  const panelOpacityAnim = useRef(new Animated.Value(1)).current;
  const speedButtonAnim = useRef(new Animated.Value(265)).current;
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    webViewRef,
    viagem,
    loading,
    errorMsg,
    faseAtual,
    mostrarConfirmacaoPaciente,
    distance,
    duration,
    instructions,
    calculandoRota,
    followUser,
    currentSpeed,
    dynamicETA,
    distanceRemaining,
    elapsedTime,
    nextInstructions,
    showManeuverAlert,
    alertDistance,
    isOffRoute,
    setMostrarConfirmacaoPaciente,
    handleRecenter,
    handleWebViewMessage,
    confirmarPacienteBuscado,
    setErrorMsg,
  } = useRideNavigation(tripId ? String(tripId) : null);

  useEffect(() => {
    if (!loading && viagem) {
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [loading, viagem]);

  const confirmEndTravel = async () => {
    if (!tripId) return;
    setShowConfirmFinish(false);
    try {
      await travelService.endTravel(Number(tripId));
      setShowSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao finalizar");
      setShowError(true);
    }
  };

  useEffect(() => {
    if (errorMsg) setShowError(true);
  }, [errorMsg]);
  const curInstruction = useMemo(() => 
    instructions.length > 0 ? instructions[0] : null,
    [instructions]
  );

  const proximaInstrucao = useMemo(() => {
    if (nextInstructions?.current) {
      return nextInstructions.current.instruction || nextInstructions.current.streetName || "Siga o trajeto";
    }
    return curInstruction?.instruction || curInstruction?.streetName || "Siga o trajeto";
  }, [nextInstructions, curInstruction, instructions]);
  
  const distInstrucao = useMemo(() => {
    if (nextInstructions?.current?.distance) {
      return nextInstructions.current.distance;
    }
    return curInstruction?.distance || 0;
  }, [nextInstructions, curInstruction]);
  
  const displayDistance = distance;
  
  const destinacaoTexto = useMemo(() => 
    faseAtual === "buscar_paciente"
      ? formatarEndereco(viagem?.end_inicio)
      : formatarEndereco(viagem?.end_fim),
    [faseAtual, viagem]
  );
      
  const idViagem = viagem?.id || (tripId ? Number(tripId) : null);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}min`;
    }
    return `${mins}min ${secs}s`;
  };

  const progress = useMemo(() => {
    if (!distance || distance === 0) return 0;
    const traveled = distance - distanceRemaining;
    return Math.min(100, Math.max(0, (traveled / distance) * 100));
  }, [distance, distanceRemaining]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isExpanded && gestureState.dy > 0) {
          const newValue = 1 - gestureState.dy / 320;
          bottomSheetAnim.setValue(Math.max(0, Math.min(1, newValue)));
        } else if (!isExpanded && gestureState.dy < 0) {
          const newValue = Math.abs(gestureState.dy) / 320;
          bottomSheetAnim.setValue(Math.max(0, Math.min(1, newValue)));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) < 10) {
          toggleBottomSheet();
          return;
        }

        const threshold = 40;
        
        if (isExpandedRef.current && gestureState.dy > threshold) {
          Animated.spring(bottomSheetAnim, {
            toValue: 0,
            useNativeDriver: false,
            friction: 8,
          }).start();
          isExpandedRef.current = false;
          setIsExpanded(false);
        } else if (!isExpandedRef.current && gestureState.dy < -threshold) {
          Animated.spring(bottomSheetAnim, {
            toValue: 1,
            useNativeDriver: false,
            friction: 8,
          }).start();
          isExpandedRef.current = true;
          setIsExpanded(true);
        } else {
          Animated.spring(bottomSheetAnim, {
            toValue: isExpandedRef.current ? 1 : 0,
            useNativeDriver: false,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const toggleBottomSheet = () => {
    const toValue = isExpandedRef.current ? 0 : 1;
    const newExpandedState = !isExpandedRef.current;
    
    Animated.spring(bottomSheetAnim, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
    
    isExpandedRef.current = newExpandedState;
    setIsExpanded(newExpandedState);
    resetInactivityTimer();
  };

  const resetInactivityTimer = () => {
    if (!preferences?.autoHideNavigationControls) return;

    if (!isHeaderVisible) {
      setIsHeaderVisible(true);
      Animated.timing(panelOpacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsHeaderVisible(false);
      Animated.timing(panelOpacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 5000);
  };

  useEffect(() => {
    if (preferences?.autoHideNavigationControls) {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [preferences?.autoHideNavigationControls]);

  useEffect(() => {
    speedButtonAnim.setValue(followUser ? 200 : 265);
  }, []);

  useEffect(() => {
    Animated.spring(speedButtonAnim, {
      toValue: followUser ? 200 : 265,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [followUser]);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-500 font-medium">Iniciando navegação...</Text>
      </View>
    );
  }

  if (!viagem && !loading) {
    return (
        <View className="flex-1 justify-center items-center p-6">
            <Feather name="alert-octagon" size={48} color="#EF4444" />
            <Text className="mt-4 text-lg font-bold text-center text-gray-800">
             {errorMsg || "Erro ao carregar viagem"}
            </Text>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-6 bg-gray-800 px-8 py-3 rounded-full"
            >
            <Text className="text-white font-bold">Voltar</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <Animated.View className="flex-1 bg-white relative" style={{ opacity: screenFadeAnim }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={StyleSheet.absoluteFill}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: buildLeafletHtml(DEFAULT_CENTER) }}
          style={{ flex: 1, backgroundColor: "#f3f4f6" }}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleWebViewMessage}
          startInLoadingState
          renderLoading={() => <View className="flex-1 bg-gray-100" />}
        />
      </View>

      <View className="absolute left-4 right-4 z-20" style={{ top: insets.top + 8 }}>
        <View className="bg-[#1C1C1E] rounded-3xl px-5 py-4 shadow-2xl border border-gray-700/50">
          <View className="flex-row items-start mb-3">
            <View className="mr-4 w-14 h-14 bg-[#2563EB] rounded-2xl items-center justify-center">
              <Feather 
                name={
                  proximaInstrucao.toLowerCase().includes('esquerda') || proximaInstrucao.toLowerCase().includes('left') ? 'arrow-left' :
                  proximaInstrucao.toLowerCase().includes('direita') || proximaInstrucao.toLowerCase().includes('right') ? 'arrow-right' :
                  proximaInstrucao.toLowerCase().includes('retorne') || proximaInstrucao.toLowerCase().includes('u-turn') ? 'rotate-ccw' :
                  'arrow-up'
                } 
                size={28} 
                color="#FFF" 
              />
            </View>

            <View className="flex-1">
              <Text className="text-white text-2xl font-extrabold leading-tight mb-1">
                {distInstrucao >= 1000 
                  ? `${(distInstrucao / 1000).toFixed(1)} km` 
                  : `${Math.round(distInstrucao)} m`}
              </Text>
              <Text className="text-gray-300 text-sm font-medium leading-snug" numberOfLines={2}>
                {proximaInstrucao}
              </Text>
            </View>

            {calculandoRota && (
              <View className="ml-2">
                <ActivityIndicator size="small" color="#60A5FA" />
              </View>
            )}
          </View>

          {nextInstructions?.upcoming && (
            <View className="flex-row items-center pl-1 pt-3 border-t border-gray-700/50">
              <View className="mr-3 w-6 h-6 bg-gray-700 rounded-lg items-center justify-center">
                <Feather 
                  name={
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('esquerda') || 
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('left') ? 'arrow-left' :
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('direita') || 
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('right') ? 'arrow-right' :
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('retorne') || 
                    nextInstructions.upcoming.instruction?.toLowerCase().includes('u-turn') ? 'rotate-ccw' :
                    'arrow-up'
                  } 
                  size={14} 
                  color="#9CA3AF" 
                />
              </View>
              <Text className="text-gray-400 text-xs font-medium flex-1" numberOfLines={1}>
                Depois: {nextInstructions.upcoming.instruction || nextInstructions.upcoming.streetName}
              </Text>
            </View>
          )}
        </View>
      </View>

      {!followUser && !isExpanded && (
        <TouchableOpacity
          onPress={handleRecenter}
          className="absolute right-4 z-20 bg-white p-3.5 rounded-full shadow-lg border border-gray-100 items-center justify-center"
          style={{ bottom: 200 }}
        >
          <Feather name="navigation" size={24} color="#2563EB" />
        </TouchableOpacity>
      )}
      {!isExpanded && (
        <Animated.View 
          className="absolute right-4 z-20 bg-white rounded-full shadow-lg border border-gray-100" 
          style={{ 
            bottom: speedButtonAnim,
            width: 64, 
            height: 64 
          }}
        >
          <View className="flex-1 items-center justify-center">
            <Text className="text-[#2563EB] text-sm font-bold">{Math.round(currentSpeed)}</Text>
            <Text className="text-gray-500 text-[10px] font-medium">km/h</Text>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute left-4 z-10 bg-white/90 p-2.5 rounded-full shadow-sm border border-gray-100"
        style={{ top: insets.top + 70 }}
      >
        <Feather name="chevron-left" size={24} color="#374151" />
      </TouchableOpacity>

      <Animated.View
        {...panResponder.panHandlers}
        onTouchStart={resetInactivityTimer}
        className="absolute bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-[32px]"
        style={{
          paddingBottom: Math.max(insets.bottom, 24),
          height: 420,
          transform: [
            {
              translateY: bottomSheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [240, 0],
              }),
            },
          ],
          opacity: panelOpacityAnim,
        }}
        pointerEvents={isHeaderVisible ? 'auto' : 'box-none'}
      >
        <View className="w-full items-center pt-3 pb-2">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        <View className="px-6 pb-4">
          <View className="flex-row justify-between items-baseline mb-3">
            <View>
              <Text className="text-[32px] font-extrabold text-[#111827] leading-tight">
                {dynamicETA} min
              </Text>
              <View className="flex-row items-center mt-1">
                <Text
                  className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                    faseAtual === "buscar_paciente" ? "bg-blue-600" : "bg-emerald-600"
                  }`}
                >
                  {faseAtual === "buscar_paciente" ? "BUSCANDO" : "EM ROTA"}
                </Text>
                <Text className="text-gray-400 text-sm ml-2 font-medium">
                  {distanceRemaining >= 1000 ? `${(distanceRemaining / 1000).toFixed(1)} km` : `${Math.round(distanceRemaining)} m`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (idViagem) navigation.navigate("Detalhes", { id: idViagem });
              }}
              className="bg-gray-50 p-3 rounded-full border border-gray-100"
            >
              <Feather name="list" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View className="mb-4 pl-1 border-l-2 border-gray-200 ml-1">
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5 ml-3">
              {faseAtual === "buscar_paciente" ? "Destino Intermediário" : "Destino Final"}
            </Text>
            <Text className="text-gray-800 text-base font-semibold ml-3" numberOfLines={2}>
              {destinacaoTexto}
            </Text>
          </View>

          {/* EXPANDIDO: Informações Detalhadas */}
          {isExpanded && (
            <Animated.View
              style={{
                opacity: bottomSheetAnim,
              }}
            >
              {/* Grid de Stats */}
              <View className="flex-row justify-between mb-4 pt-4 border-t border-gray-200">
                <View className="flex-1 items-center">
                  <Text className="text-gray-500 text-xs font-bold uppercase">Velocidade</Text>
                  <Text className="text-[#111827] text-2xl font-extrabold">{Math.round(currentSpeed)}</Text>
                  <Text className="text-gray-500 text-xs">km/h</Text>
                </View>
                
                <View className="flex-1 items-center border-l border-r border-gray-200">
                  <Text className="text-gray-500 text-xs font-bold uppercase">Progresso</Text>
                  <Text className="text-[#111827] text-2xl font-extrabold">{progress.toFixed(0)}</Text>
                  <Text className="text-gray-500 text-xs">%</Text>
                </View>
                
                <View className="flex-1 items-center">
                  <Text className="text-gray-500 text-xs font-bold uppercase">Tempo</Text>
                  <Text className="text-[#111827] text-xl font-extrabold">{formatElapsedTime(elapsedTime)}</Text>
                </View>
              </View>

              {/* Barra de Progresso */}
              <View className="mb-4">
                <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </View>
              </View>

              {/* Próxima Instrução Preview */}
              {nextInstructions?.upcoming && (
                <View className="bg-gray-50 rounded-2xl p-3 mb-3">
                  <Text className="text-gray-500 text-xs font-bold mb-1">PRÓXIMA MANOBRA</Text>
                  <Text className="text-gray-800 text-sm font-semibold">
                    {nextInstructions.upcoming.instruction || nextInstructions.upcoming.streetName}
                  </Text>
                  {nextInstructions.upcoming.distance && (
                    <Text className="text-gray-500 text-xs mt-1">
                      Em {(nextInstructions.upcoming.distance / 1000).toFixed(1)} km
                    </Text>
                  )}
                </View>
              )}

              {/* Badge Off-Route */}
              {isOffRoute && (
                <View className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3">
                  <Text className="text-red-600 font-bold text-sm">⚠️ Você está fora da rota</Text>
                </View>
              )}

              {/* Ação - SÓ VISÍVEL QUANDO EXPANDIDO */}
              {faseAtual === "buscar_paciente" ? (
                <TouchableOpacity
                  onPress={() => {
                    if (!__DEV__ && displayDistance > 150) {
                        Alert.alert(
                            "Longe do Local",
                            `Você está a ${Math.round(displayDistance)}m do local. Aproxime-se para confirmar.`
                        );
                        return;
                    }
                    setMostrarConfirmacaoPaciente(true);
                  }}
                  className="w-full bg-[#2563EB] h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  <Feather name="user-check" size={22} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Confirmar Embarque</Text>
                </TouchableOpacity>
              ) : (
                 <TouchableOpacity
                  onPress={() => {
                    if (!__DEV__ && displayDistance > 150) {
                        Alert.alert(
                            "Longe do Local",
                            `Você está a ${Math.round(displayDistance)}m do local. Aproxime-se para finalizar.`
                        );
                        return;
                    }
                    setShowConfirmFinish(true);
                  }}
                  className="w-full bg-emerald-600 h-14 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-200 active:scale-[0.98]"
                >
                  <Feather name="check-circle" size={22} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Finalizar Viagem</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* MODALS */}
      <ConfirmModal
        visible={mostrarConfirmacaoPaciente}
        title="Paciente a Bordo?"
        message="Confirme se o paciente já está na ambulância."
        onConfirm={confirmarPacienteBuscado}
        confirmText="Sim, prosseguir"
        type="info"
        onCancel={() => setMostrarConfirmacaoPaciente(false)}
      />

      <ConfirmModal
        visible={showConfirmFinish}
        title="Encerrar Viagem"
        message="Deseja finalizar a corrida e liberar a ambulância?"
        onConfirm={confirmEndTravel}
        confirmText="Encerrar"
        type="danger"
        onCancel={() => setShowConfirmFinish(false)}
      />

      <ConfirmModal
        visible={showSuccess}
        title="Sucesso"
        message="Viagem finalizada com sucesso!"
        onConfirm={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        confirmText="OK"
        type="success"
        onCancel={() => {}}
      />

      <ConfirmModal
        visible={showError}
        title="Erro"
        message={errorMsg || "Erro desconhecido"}
        onConfirm={() => setShowError(false)}
        confirmText="OK"
        type="danger"
        onCancel={() => setShowError(false)}
      />
    </Animated.View>
  );
}
