import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('should render card with content', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should render with default padding', () => {
    render(<Card data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).toHaveClass('p-6')
  })

  it('should render with small padding', () => {
    render(<Card padding="sm" data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).toHaveClass('p-4')
  })

  it('should render with no padding', () => {
    render(<Card padding="none" data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).not.toHaveClass('p-6', 'p-4')
  })

  it('should render with default variant styles', () => {
    render(<Card data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-xl', 'shadow-sm')
  })

  it('should render with success variant styles', () => {
    render(<Card variant="success" data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).toHaveClass('bg-green-50', 'border-green-200', 'text-green-800')
  })

  it('should apply custom className', () => {
    render(<Card className="custom-class" data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('bg-white') // Should still have base classes
  })

  it('should render as different HTML element when specified', () => {
    render(<Card as="section" data-testid="card">Card content</Card>)
    const card = screen.getByTestId('card')
    
    expect(card.tagName).toBe('SECTION')
  })

  it('should pass through additional props', () => {
    render(
      <Card data-testid="card" role="banner" aria-label="Test card">
        Card content
      </Card>
    )
    const card = screen.getByTestId('card')
    
    expect(card).toHaveAttribute('role', 'banner')
    expect(card).toHaveAttribute('aria-label', 'Test card')
  })
})