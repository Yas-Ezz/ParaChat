// Async Demo Manager - Demonstrates different asynchronous patterns
export class AsyncDemoManager {
    constructor() {
        this.demoOutput = document.getElementById('demo-output');
        this.demoContent = document.getElementById('demo-content');
    }

    init() {
        console.log('🎯 Async Demo Manager initialized');
    }

    showDemoOutput() {
        this.demoOutput.classList.remove('hidden');
        this.demoContent.innerHTML = '';
    }

    addToOutput(text, type = 'info') {
        const line = document.createElement('div');
        line.className = 'mb-1';
        
        const timestamp = new Date().toLocaleTimeString();
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
        
        line.innerHTML = `<span class="text-gray-400">[${timestamp}]</span> ${icon} ${text}`;
        this.demoContent.appendChild(line);
        
        // Auto-scroll to bottom
        this.demoOutput.scrollTop = this.demoOutput.scrollHeight;
    }

    // CALLBACK PATTERN DEMONSTRATION
    demonstrateCallbacks() {
        this.showDemoOutput();
        this.addToOutput('🔄 Starting Callback Pattern Demo...', 'info');
        
        // Example 1: Simple callback
        this.addToOutput('Example 1: Simple Callback Function');
        this.simulateDataFetch('user-data', (error, data) => {
            if (error) {
                this.addToOutput(`Error: ${error.message}`, 'error');
            } else {
                this.addToOutput(`Success: Received ${data.type} - ${data.value}`, 'success');
            }
        });

        // Example 2: Nested callbacks (Callback Hell)
        setTimeout(() => {
            this.addToOutput('Example 2: Nested Callbacks (Callback Hell)');
            this.simulateDataFetch('step1', (error1, data1) => {
                if (error1) {
                    this.addToOutput(`Step 1 Error: ${error1.message}`, 'error');
                    return;
                }
                this.addToOutput(`Step 1 Complete: ${data1.value}`);
                
                this.simulateDataFetch('step2', (error2, data2) => {
                    if (error2) {
                        this.addToOutput(`Step 2 Error: ${error2.message}`, 'error');
                        return;
                    }
                    this.addToOutput(`Step 2 Complete: ${data2.value}`);
                    
                    this.simulateDataFetch('step3', (error3, data3) => {
                        if (error3) {
                            this.addToOutput(`Step 3 Error: ${error3.message}`, 'error');
                            return;
                        }
                        this.addToOutput(`Step 3 Complete: ${data3.value}`, 'success');
                        this.addToOutput('🎉 All callback steps completed!', 'success');
                    });
                });
            });
        }, 2000);

        // Example 3: Error handling with callbacks
        setTimeout(() => {
            this.addToOutput('Example 3: Error Handling with Callbacks');
            this.simulateDataFetch('error-prone-operation', (error, data) => {
                if (error) {
                    this.addToOutput(`Handled Error: ${error.message}`, 'error');
                    this.addToOutput('Implementing fallback strategy...');
                    
                    // Fallback operation
                    this.simulateDataFetch('fallback-data', (fallbackError, fallbackData) => {
                        if (fallbackError) {
                            this.addToOutput('Fallback also failed!', 'error');
                        } else {
                            this.addToOutput(`Fallback Success: ${fallbackData.value}`, 'success');
                        }
                    });
                } else {
                    this.addToOutput(`Primary operation succeeded: ${data.value}`, 'success');
                }
            });
        }, 5000);
    }

    // PROMISE PATTERN DEMONSTRATION
    demonstratePromises() {
        this.showDemoOutput();
        this.addToOutput('🔄 Starting Promise Pattern Demo...', 'info');

        // Example 1: Basic Promise
        this.addToOutput('Example 1: Basic Promise');
        this.simulateDataFetchPromise('user-profile')
            .then(data => {
                this.addToOutput(`Promise Resolved: ${data.value}`, 'success');
            })
            .catch(error => {
                this.addToOutput(`Promise Rejected: ${error.message}`, 'error');
            });

        // Example 2: Promise Chaining
        setTimeout(() => {
            this.addToOutput('Example 2: Promise Chaining');
            this.simulateDataFetchPromise('initial-data')
                .then(data => {
                    this.addToOutput(`Chain Step 1: ${data.value}`);
                    return this.simulateDataFetchPromise('processed-data');
                })
                .then(data => {
                    this.addToOutput(`Chain Step 2: ${data.value}`);
                    return this.simulateDataFetchPromise('final-data');
                })
                .then(data => {
                    this.addToOutput(`Chain Step 3: ${data.value}`, 'success');
                    this.addToOutput('🎉 Promise chain completed!', 'success');
                })
                .catch(error => {
                    this.addToOutput(`Chain Error: ${error.message}`, 'error');
                });
        }, 2000);

        // Example 3: Promise.all()
        setTimeout(() => {
            this.addToOutput('Example 3: Promise.all() - Parallel Execution');
            const promises = [
                this.simulateDataFetchPromise('data-source-1'),
                this.simulateDataFetchPromise('data-source-2'),
                this.simulateDataFetchPromise('data-source-3')
            ];

            Promise.all(promises)
                .then(results => {
                    this.addToOutput('All promises resolved:', 'success');
                    results.forEach((result, index) => {
                        this.addToOutput(`  Source ${index + 1}: ${result.value}`);
                    });
                })
                .catch(error => {
                    this.addToOutput(`Promise.all failed: ${error.message}`, 'error');
                });
        }, 4000);

        // Example 4: Promise.race()
        setTimeout(() => {
            this.addToOutput('Example 4: Promise.race() - First to Complete');
            const racePromises = [
                this.simulateDataFetchPromise('slow-server', 3000),
                this.simulateDataFetchPromise('fast-server', 1000),
                this.simulateDataFetchPromise('medium-server', 2000)
            ];

            Promise.race(racePromises)
                .then(result => {
                    this.addToOutput(`Race winner: ${result.value}`, 'success');
                })
                .catch(error => {
                    this.addToOutput(`Race error: ${error.message}`, 'error');
                });
        }, 6000);
    }

    // ASYNC/AWAIT PATTERN DEMONSTRATION
    async demonstrateAsyncAwait() {
        this.showDemoOutput();
        this.addToOutput('🔄 Starting Async/Await Pattern Demo...', 'info');

        try {
            // Example 1: Basic async/await
            this.addToOutput('Example 1: Basic Async/Await');
            const userData = await this.simulateDataFetchPromise('user-info');
            this.addToOutput(`Async/Await Result: ${userData.value}`, 'success');

            // Example 2: Sequential operations
            this.addToOutput('Example 2: Sequential Operations');
            const step1 = await this.simulateDataFetchPromise('sequential-step-1');
            this.addToOutput(`Sequential Step 1: ${step1.value}`);
            
            const step2 = await this.simulateDataFetchPromise('sequential-step-2');
            this.addToOutput(`Sequential Step 2: ${step2.value}`);
            
            const step3 = await this.simulateDataFetchPromise('sequential-step-3');
            this.addToOutput(`Sequential Step 3: ${step3.value}`, 'success');

            // Example 3: Parallel operations with async/await
            this.addToOutput('Example 3: Parallel Operations with Async/Await');
            const parallelPromises = [
                this.simulateDataFetchPromise('parallel-task-1'),
                this.simulateDataFetchPromise('parallel-task-2'),
                this.simulateDataFetchPromise('parallel-task-3')
            ];
            
            const parallelResults = await Promise.all(parallelPromises);
            this.addToOutput('Parallel tasks completed:', 'success');
            parallelResults.forEach((result, index) => {
                this.addToOutput(`  Task ${index + 1}: ${result.value}`);
            });

            // Example 4: Error handling with try/catch
            this.addToOutput('Example 4: Error Handling with Try/Catch');
            try {
                const riskyData = await this.simulateDataFetchPromise('risky-operation');
                this.addToOutput(`Risky operation succeeded: ${riskyData.value}`, 'success');
            } catch (error) {
                this.addToOutput(`Caught error: ${error.message}`, 'error');
                
                // Fallback operation
                this.addToOutput('Attempting fallback...');
                const fallbackData = await this.simulateDataFetchPromise('fallback-operation');
                this.addToOutput(`Fallback succeeded: ${fallbackData.value}`, 'success');
            }

            // Example 5: Async iteration
            this.addToOutput('Example 5: Async Iteration');
            const dataSources = ['source-a', 'source-b', 'source-c'];
            
            for (const source of dataSources) {
                const data = await this.simulateDataFetchPromise(source);
                this.addToOutput(`Processed ${source}: ${data.value}`);
            }
            
            this.addToOutput('🎉 All async/await examples completed!', 'success');

        } catch (error) {
            this.addToOutput(`Async/Await Demo Error: ${error.message}`, 'error');
        }
    }

    // Utility function to simulate callback-based operations
    simulateDataFetch(operation, callback) {
        const delay = Math.random() * 2000 + 500; // 500-2500ms delay
        const shouldFail = operation.includes('error') ? Math.random() > 0.3 : Math.random() > 0.9;

        setTimeout(() => {
            if (shouldFail) {
                callback(new Error(`Operation '${operation}' failed`), null);
            } else {
                callback(null, {
                    type: operation,
                    value: `Data from ${operation} (${Math.floor(delay)}ms)`,
                    timestamp: new Date().toISOString()
                });
            }
        }, delay);
    }

    // Utility function to simulate promise-based operations
    simulateDataFetchPromise(operation, customDelay = null) {
        const delay = customDelay || (Math.random() * 2000 + 500);
        const shouldFail = operation.includes('risky') ? Math.random() > 0.5 : Math.random() > 0.9;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error(`Promise operation '${operation}' failed`));
                } else {
                    resolve({
                        type: operation,
                        value: `Promise data from ${operation} (${Math.floor(delay)}ms)`,
                        timestamp: new Date().toISOString()
                    });
                }
            }, delay);
        });
    }
}