import { useState, useCallback, useEffect } from 'react';
import apiService from '../services/api';

// Global state for data refresh
let globalDataRefreshCallbacks = [];
let isGlobalRefreshing = false;
let globalRefreshListeners = [];

const useGlobalData = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to trigger global data refresh
  const triggerGlobalRefresh = useCallback(() => {
    if (isGlobalRefreshing) return; // Prevent multiple simultaneous refreshes
    
    isGlobalRefreshing = true;
    const newTrigger = Date.now();
    setRefreshTrigger(newTrigger);
    
    // Notify all refresh listeners that refresh started
    globalRefreshListeners.forEach(listener => {
      try {
        listener(true);
      } catch (error) {
        console.error('Error in global refresh listener:', error);
      }
    });
    
    // Notify all registered callbacks
    Promise.all(
      globalDataRefreshCallbacks.map(async (callback) => {
        try {
          await callback();
        } catch (error) {
          console.error('Error in global refresh callback:', error);
        }
      })
    ).finally(() => {
      isGlobalRefreshing = false;
      
      // Notify all refresh listeners that refresh ended
      globalRefreshListeners.forEach(listener => {
        try {
          listener(false);
        } catch (error) {
          console.error('Error in global refresh listener:', error);
        }
      });
    });
  }, []);

  // Register a callback for data refresh
  const registerRefreshCallback = useCallback((callback) => {
    globalDataRefreshCallbacks.push(callback);
    
    // Return cleanup function
    return () => {
      globalDataRefreshCallbacks = globalDataRefreshCallbacks.filter(cb => cb !== callback);
    };
  }, []);

  // Register a listener for refresh state changes
  const registerRefreshListener = useCallback((listener) => {
    globalRefreshListeners.push(listener);
    
    // Return cleanup function
    return () => {
      globalRefreshListeners = globalRefreshListeners.filter(l => l !== listener);
    };
  }, []);

  // Load all data
  const loadAllData = useCallback(async () => {
    try {
      const [contractsResponse, guarantorsResponse, paymentsResponse] = await Promise.all([
        apiService.getContracts(),
        apiService.getGuarantors(),
        apiService.getPayments()
      ]);
      
      // Filter valid data
      const validContracts = (contractsResponse.contracts || []).filter(contract => contract && contract._id);
      const validGuarantors = (guarantorsResponse.guarantors || []).filter(guarantor => guarantor && guarantor._id);
      const validPayments = (paymentsResponse.payments || []).filter(payment => payment && payment._id);
      
      // Create maps for quick lookup
      const guarantorMap = {};
      validGuarantors.forEach(guarantor => {
        guarantorMap[guarantor._id] = guarantor;
      });
      
      const paymentsByContract = {};
      validPayments.forEach(payment => {
        const contractId = typeof payment.contract === 'object' ? payment.contract._id : payment.contract;
        if (!paymentsByContract[contractId]) {
          paymentsByContract[contractId] = [];
        }
        paymentsByContract[contractId].push(payment);
      });
      
      // Populate contracts with full data
      const populatedContracts = validContracts.map(contract => ({
        ...contract,
        guarantor: guarantorMap[contract.guarantor] || contract.guarantor,
        payments: paymentsByContract[contract._id] || []
      }));
      
      return {
        contracts: populatedContracts,
        guarantors: validGuarantors,
        payments: validPayments
      };
    } catch (error) {
      console.error('Error loading global data:', error);
      throw error;
    }
  }, []);

  return {
    refreshTrigger,
    isRefreshing,
    triggerGlobalRefresh,
    registerRefreshCallback,
    registerRefreshListener,
    loadAllData
  };
};

export default useGlobalData;