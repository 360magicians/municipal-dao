import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react"
import Link from "next/link"

const treasuryAssets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "1,250.45",
    value: "$2,100,945",
    change: "+5.2%",
    changeValue: "+$103,847",
    allocation: 85.7,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: "250,000",
    value: "$250,000",
    change: "0%",
    changeValue: "$0",
    allocation: 10.2,
    color: "from-green-500 to-green-600",
  },
  {
    name: "DAO Token",
    symbol: "DAO",
    amount: "500,000",
    value: "$100,500",
    change: "+12.8%",
    changeValue: "+$11,400",
    allocation: 4.1,
    color: "from-purple-500 to-purple-600",
  },
]

const transactions = [
  {
    id: 1,
    type: "outgoing",
    description: "Marketing Budget Allocation",
    amount: "-$50,000",
    asset: "USDC",
    date: "2024-01-18",
    status: "completed",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    type: "incoming",
    description: "Token Sale Revenue",
    amount: "+$125,000",
    asset: "ETH",
    date: "2024-01-17",
    status: "completed",
    txHash: "0x2345...6789",
  },
  {
    id: 3,
    type: "outgoing",
    description: "Developer Grant Payment",
    amount: "-$25,000",
    asset: "USDC",
    date: "2024-01-16",
    status: "completed",
    txHash: "0x3456...7890",
  },
  {
    id: 4,
    type: "incoming",
    description: "Staking Rewards",
    amount: "+$8,500",
    asset: "ETH",
    date: "2024-01-15",
    status: "completed",
    txHash: "0x4567...8901",
  },
  {
    id: 5,
    type: "outgoing",
    description: "Security Audit Payment",
    amount: "-$30,000",
    asset: "USDC",
    date: "2024-01-14",
    status: "pending",
    txHash: "0x5678...9012",
  },
]

const budgetCategories = [
  {
    name: "Development",
    allocated: 150000,
    spent: 89000,
    remaining: 61000,
    color: "bg-blue-500",
  },
  {
    name: "Marketing",
    allocated: 100000,
    spent: 75000,
    remaining: 25000,
    color: "bg-green-500",
  },
  {
    name: "Operations",
    allocated: 80000,
    spent: 45000,
    remaining: 35000,
    color: "bg-purple-500",
  },
  {
    name: "Security",
    allocated: 60000,
    spent: 30000,
    remaining: 30000,
    color: "bg-red-500",
  },
  {
    name: "Community",
    allocated: 40000,
    spent: 22000,
    remaining: 18000,
    color: "bg-yellow-500",
  },
]

export default function TreasuryPage() {
  const totalValue = treasuryAssets.reduce((sum, asset) => sum + Number.parseFloat(asset.value.replace(/[$,]/g, "")), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold">DeveloperDAO</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/proposals" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Proposals
              </Link>
              <Link href="/members" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Members
              </Link>
              <Link href="/treasury" className="text-sm font-medium text-blue-600">
                Treasury
              </Link>
            </nav>
            <Button>Connect Wallet</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Treasury</h1>
            <p className="text-muted-foreground mt-2">Monitor DAO assets, transactions, and budget allocation</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${(totalValue / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-muted-foreground">Total Treasury Value</div>
          </div>
        </div>

        {/* Treasury Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {treasuryAssets.map((asset, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{asset.name}</CardTitle>
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${asset.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                >
                  {asset.symbol.charAt(0)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{asset.value}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {asset.amount} {asset.symbol}
                </div>
                <div
                  className={`flex items-center text-xs ${asset.change.startsWith("+") ? "text-green-600" : asset.change.startsWith("-") ? "text-red-600" : "text-muted-foreground"}`}
                >
                  {asset.change.startsWith("+") ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : asset.change.startsWith("-") ? (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  ) : null}
                  {asset.change} ({asset.changeValue})
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Allocation</span>
                    <span>{asset.allocation}%</span>
                  </div>
                  <Progress value={asset.allocation} className="h-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent treasury transactions and transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "incoming" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {tx.type === "incoming" ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{tx.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {tx.date} • {tx.asset}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${tx.type === "incoming" ? "text-green-600" : "text-red-600"}`}>
                          {tx.amount}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={tx.status === "completed" ? "secondary" : "outline"}>{tx.status}</Badge>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Track spending across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                        </div>
                      </div>
                      <Progress value={(category.spent / category.allocated) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((category.spent / category.allocated) * 100).toFixed(1)}% used</span>
                        <span>${category.remaining.toLocaleString()} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Inflow</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$133,500</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$105,000</div>
                  <p className="text-xs text-muted-foreground">-5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Runway</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23 months</div>
                  <p className="text-xs text-muted-foreground">At current burn rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+15.2%</div>
                  <p className="text-xs text-muted-foreground">Year to date</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Treasury Performance</CardTitle>
                <CardDescription>Historical value and growth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Treasury performance chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
