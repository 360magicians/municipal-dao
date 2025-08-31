import { spawn } from "child_process"

interface TestResult {
  suite: string
  passed: boolean
  output: string
  duration: number
}

class PlatformTestRunner {
  private results: TestResult[] = []

  async runTest(testCommand: string, suiteName: string): Promise<TestResult> {
    return new Promise((resolve) => {
      const startTime = Date.now()
      console.log(`🧪 Running ${suiteName} tests...`)

      const [command, ...args] = testCommand.split(" ")
      const testProcess = spawn(command, args, {
        cwd: process.cwd(),
        stdio: "pipe",
        env: { ...process.env, NODE_ENV: "test" },
      })

      let output = ""
      let errorOutput = ""

      testProcess.stdout?.on("data", (data) => {
        const chunk = data.toString()
        output += chunk
        process.stdout.write(chunk)
      })

      testProcess.stderr?.on("data", (data) => {
        const chunk = data.toString()
        errorOutput += chunk
        process.stderr.write(chunk)
      })

      testProcess.on("close", (code) => {
        const duration = Date.now() - startTime
        const result: TestResult = {
          suite: suiteName,
          passed: code === 0,
          output: output + errorOutput,
          duration,
        }

        if (result.passed) {
          console.log(`✅ ${suiteName} tests passed (${duration}ms)`)
        } else {
          console.log(`❌ ${suiteName} tests failed (${duration}ms)`)
        }

        resolve(result)
      })

      testProcess.on("error", (error) => {
        const duration = Date.now() - startTime
        const result: TestResult = {
          suite: suiteName,
          passed: false,
          output: `Error running tests: ${error.message}`,
          duration,
        }
        console.log(`❌ ${suiteName} tests failed with error: ${error.message}`)
        resolve(result)
      })
    })
  }

  async runAllTests(): Promise<void> {
    console.log("🚀 Starting MBTQ Platform Test Suite...\n")

    // Test suites to run
    const testSuites = [
      { command: "npm run test:database", name: "Database Tests" },
      { command: "npm run test:clerk", name: "Clerk Authentication Tests" },
      { command: "npm run test:supabase", name: "Supabase Integration Tests" },
      { command: "npm run test:deafauth", name: "DeafAUTH Integration Tests" },
    ]

    // Run tests sequentially
    for (const suite of testSuites) {
      const result = await this.runTest(suite.command, suite.name)
      this.results.push(result)
    }

    // Print summary
    this.printSummary()
  }

  private printSummary(): void {
    console.log("\n" + "=".repeat(60))
    console.log("📊 TEST SUMMARY")
    console.log("=".repeat(60))

    const totalTests = this.results.length
    const passedTests = this.results.filter((r) => r.passed).length
    const failedTests = totalTests - passedTests
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0)

    console.log(`Total Test Suites: ${totalTests}`)
    console.log(`Passed: ${passedTests} ✅`)
    console.log(`Failed: ${failedTests} ${failedTests > 0 ? "❌" : ""}`)
    console.log(`Total Duration: ${totalDuration}ms`)
    console.log("")

    // Detailed results
    this.results.forEach((result) => {
      const status = result.passed ? "✅ PASS" : "❌ FAIL"
      console.log(`${status} ${result.suite} (${result.duration}ms)`)
    })

    if (failedTests > 0) {
      console.log("\n❌ FAILED TEST DETAILS:")
      console.log("-".repeat(40))
      this.results
        .filter((r) => !r.passed)
        .forEach((result) => {
          console.log(`\n${result.suite}:`)
          console.log(result.output.slice(-500)) // Last 500 chars of output
        })
    }

    console.log("\n" + "=".repeat(60))

    if (failedTests === 0) {
      console.log("🎉 All tests passed! Your MBTQ ecosystem is ready!")
    } else {
      console.log("🔧 Some tests failed. Please check the details above.")
      process.exit(1)
    }
  }
}

// Run the tests
if (require.main === module) {
  const runner = new PlatformTestRunner()
  runner.runAllTests().catch((error) => {
    console.error("❌ Test runner failed:", error)
    process.exit(1)
  })
}

export { PlatformTestRunner }
